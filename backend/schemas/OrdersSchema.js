const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  name: { type: String, required: true, uppercase: true, trim: true },
  qty: { type: Number, required: true, min: 0.000001 },
  price: { type: Number, required: true, min: 0.01 },
  mode: { type: String, enum: ["BUY", "SELL"], default: "BUY" },
  product: { type: String, default: "CNC" },
  status: { type: String, default: "COMPLETE" },
}, { timestamps: true });

module.exports = { OrdersSchema };
