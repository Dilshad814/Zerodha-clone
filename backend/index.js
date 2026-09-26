require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const { promisify } = require("util");
const http = require("http");
const path = require("path");
const { pathToFileURL } = require("url");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const scrypt = promisify(crypto.scrypt);
let usingMemoryStore = false;
const memoryState = { holdings: [], positions: [], orders: [], balance: 50000, accounts: [] };
const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });
const AccountModel = mongoose.models.Account || mongoose.model("Account", AccountSchema);

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true }));
app.use(express.json());

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const demoHoldings = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
  { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
  { name: "ITC", qty: 5, avg: 202, price: 207.9, net: "+2.92%", day: "+0.80%" },
  { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
  { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
  { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%", isLoss: true },
  { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
  { name: "SGBMAY29", qty: 2, avg: 4727, price: 4719, net: "-0.17%", day: "+0.15%", isLoss: true },
  { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
  { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
  { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
];
const demoPositions = [
  { product: "CNC", name: "EVEREADY", qty: 2, avg: 312.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
  { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
];

app.get("/api/health", (_req, res) => res.json({ ok: true, database: usingMemoryStore ? "local demo memory" : "connected" }));
app.post("/api/signup", asyncRoute(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2 || name.length > 80) return res.status(400).json({ message: "Name 2 se 80 characters ke beech hona chahiye." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Valid email address enter karein." });
  if (password.length < 8) return res.status(400).json({ message: "Password kam se kam 8 characters ka hona chahiye." });
  if (usingMemoryStore && memoryState.accounts.some((account) => account.email === email)) return res.status(409).json({ message: "Is email se account pehle se bana hua hai." });
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  if (usingMemoryStore) {
    memoryState.accounts.push({ name, email, passwordHash: `${salt}:${derivedKey.toString("hex")}` });
    return res.status(201).json({ message: `Demo account created for ${name}.`, account: { name, email } });
  }
  try {
    const account = await AccountModel.create({ name, email, passwordHash: `${salt}:${derivedKey.toString("hex")}` });
    res.status(201).json({ message: `Demo account created for ${account.name}.`, account: { name: account.name, email: account.email } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Is email se account pehle se bana hua hai." });
    throw error;
  }
}));
app.get("/allHoldings", asyncRoute(async (_req, res) => res.json(usingMemoryStore ? [...memoryState.holdings].sort((a, b) => a.name.localeCompare(b.name)) : await HoldingsModel.find().sort({ name: 1 }))));
app.get("/allPositions", asyncRoute(async (_req, res) => res.json(usingMemoryStore ? memoryState.positions : await PositionsModel.find().sort({ name: 1 }))));
app.get("/allOrders", asyncRoute(async (_req, res) => res.json(usingMemoryStore ? [...memoryState.orders].sort((a, b) => b.createdAt - a.createdAt) : await OrdersModel.find().sort({ createdAt: -1 }))));
app.get("/api/funds", asyncRoute(async (_req, res) => {
  if (usingMemoryStore) return res.json({ _id: "demo", balance: memoryState.balance });
  const funds = await FundsModel.findOneAndUpdate({ _id: "demo" }, { $setOnInsert: { balance: 50000 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.json(funds);
}));

const FundsSchema = new mongoose.Schema({ _id: { type: String, default: "demo" }, balance: { type: Number, default: 50000, min: 0 } }, { timestamps: true });
const FundsModel = mongoose.models.Funds || mongoose.model("Funds", FundsSchema);

app.post("/newOrder", asyncRoute(async (req, res) => {
  const { name, qty, price, mode = "BUY", product = "CNC" } = req.body;
  const quantity = Number(qty);
  const orderPrice = Number(price);
  const side = String(mode).toUpperCase();
  if (!name || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(orderPrice) || orderPrice <= 0 || !["BUY", "SELL"].includes(side)) {
    return res.status(400).json({ message: "Valid stock, quantity, price, and BUY/SELL mode are required." });
  }

  if (usingMemoryStore) {
    const holdingIndex = memoryState.holdings.findIndex((item) => item.name === String(name).toUpperCase());
    const currentHolding = memoryState.holdings[holdingIndex];
    const total = quantity * orderPrice;
    if (side === "BUY") {
      if (memoryState.balance < total) return res.status(400).json({ message: "Insufficient demo funds for this order." });
      if (currentHolding) {
        currentHolding.avg = ((currentHolding.avg * currentHolding.qty) + total) / (currentHolding.qty + quantity);
        currentHolding.qty += quantity;
        currentHolding.price = orderPrice;
      } else {
        memoryState.holdings.push({ name: String(name).toUpperCase(), qty: quantity, avg: orderPrice, price: orderPrice, net: "0.00%", day: "0.00%" });
      }
      memoryState.balance -= total;
    } else {
      if (!currentHolding || currentHolding.qty < quantity) return res.status(400).json({ message: "You do not own enough shares to sell." });
      currentHolding.qty -= quantity;
      currentHolding.price = orderPrice;
      if (!currentHolding.qty) memoryState.holdings.splice(holdingIndex, 1);
      memoryState.balance += total;
    }
    const order = { _id: crypto.randomUUID(), name: String(name).toUpperCase(), qty: quantity, price: orderPrice, mode: side, product, status: "COMPLETE", createdAt: new Date() };
    memoryState.orders.push(order);
    return res.status(201).json({ order, funds: { _id: "demo", balance: memoryState.balance }, message: `${side} order completed in demo mode.` });
  }

  const funds = await FundsModel.findOneAndUpdate({ _id: "demo" }, { $setOnInsert: { balance: 50000 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  let holding = await HoldingsModel.findOne({ name: String(name).toUpperCase() });
  const total = quantity * orderPrice;
  if (side === "BUY") {
    if (funds.balance < total) return res.status(400).json({ message: "Insufficient demo funds for this order." });
    const oldQty = holding?.qty || 0;
    const avg = oldQty ? ((holding.avg * oldQty) + total) / (oldQty + quantity) : orderPrice;
    if (!holding) holding = new HoldingsModel({ name: String(name).toUpperCase(), qty: quantity, avg, price: orderPrice, net: "0.00%", day: "0.00%" });
    else Object.assign(holding, { qty: oldQty + quantity, avg, price: orderPrice });
    await holding.save();
    funds.balance -= total;
  } else {
    if (!holding || holding.qty < quantity) return res.status(400).json({ message: "You do not own enough shares to sell." });
    holding.qty -= quantity;
    holding.price = orderPrice;
    if (holding.qty === 0) await holding.deleteOne();
    else await holding.save();
    funds.balance += total;
  }
  await funds.save();
  const order = await OrdersModel.create({ name: String(name).toUpperCase(), qty: quantity, price: orderPrice, mode: side, product, status: "COMPLETE" });
  res.status(201).json({ order, funds, message: `${side} order completed in demo mode.` });
}));

app.post("/api/funds/deposit", asyncRoute(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return res.status(400).json({ message: "Enter a valid deposit amount (up to ₹1 crore)." });
  if (usingMemoryStore) {
    memoryState.balance += amount;
    return res.json({ _id: "demo", balance: memoryState.balance });
  }
  const funds = await FundsModel.findOneAndUpdate({ _id: "demo" }, { $setOnInsert: { balance: 50000 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  funds.balance += amount;
  await funds.save();
  res.json(funds);
}));
app.post("/api/funds/withdraw", asyncRoute(async (req, res) => {
  const amount = Number(req.body.amount);
  if (usingMemoryStore) {
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Enter a valid withdrawal amount." });
    if (memoryState.balance < amount) return res.status(400).json({ message: "Withdrawal amount exceeds available demo funds." });
    memoryState.balance -= amount;
    return res.json({ _id: "demo", balance: memoryState.balance });
  }
  const funds = await FundsModel.findOneAndUpdate({ _id: "demo" }, { $setOnInsert: { balance: 50000 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Enter a valid withdrawal amount." });
  if (funds.balance < amount) return res.status(400).json({ message: "Withdrawal amount exceeds available demo funds." });
  funds.balance -= amount;
  await funds.save();
  res.json(funds);
}));

app.post("/api/demo/seed", asyncRoute(async (_req, res) => {
  if (usingMemoryStore) {
    if (!memoryState.holdings.length) memoryState.holdings = demoHoldings.map((item) => ({ ...item }));
    if (!memoryState.positions.length) memoryState.positions = demoPositions.map((item) => ({ ...item }));
    return res.json({ message: "Demo data is ready.", holdings: memoryState.holdings.length, positions: memoryState.positions.length });
  }
  await HoldingsModel.bulkWrite(demoHoldings.map((holding) => ({
    updateOne: { filter: { name: holding.name }, update: { $setOnInsert: holding }, upsert: true },
  })));
  await PositionsModel.bulkWrite(demoPositions.map((position) => ({
    updateOne: { filter: { name: position.name }, update: { $setOnInsert: position }, upsert: true },
  })));
  await FundsModel.findOneAndUpdate({ _id: "demo" }, { $setOnInsert: { balance: 50000 } }, { upsert: true, new: true });
  res.json({ message: "Demo data is ready.", holdings: await HoldingsModel.countDocuments(), positions: await PositionsModel.countDocuments() });
}));

async function start() {
  if (process.env.MONGO_URL) {
    try {
      await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection failed; using temporary in-memory demo data:", error.message);
      usingMemoryStore = true;
      memoryState.holdings = demoHoldings.map((item) => ({ ...item }));
      memoryState.positions = demoPositions.map((item) => ({ ...item }));
    }
  } else {
    console.warn("MONGO_URL is missing. API is starting, but database routes will not work.");
  }

  const dashboardRoot = path.resolve(__dirname, "../dashboard");
  const viteEntry = path.join(dashboardRoot, "node_modules", "vite", "dist", "node", "index.js");
  const { createServer: createViteServer } = await import(pathToFileURL(viteEntry).href);
  const httpServer = http.createServer(app);
  const vite = await createViteServer({
    root: dashboardRoot,
    configFile: path.join(dashboardRoot, "vite.config.js"),
    appType: "spa",
    server: { middlewareMode: true, hmr: { server: httpServer } },
  });
  app.use(vite.middlewares);
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong on the server." });
  });
  httpServer.listen(PORT, () => console.log(`Full Zerodha demo running at http://localhost:${PORT}`));
}

start();
