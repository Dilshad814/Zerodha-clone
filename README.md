# Zerodha learning project

A college learning project with a React landing site, a Vite trading dashboard, and an Express/MongoDB API. Trading, account creation, and fund movement are demo-only; they do not connect to Zerodha or move real money.

## Run locally

Requirements: Node.js and a MongoDB instance (local MongoDB or your own Atlas database).

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URL` to your own database connection string. Keep `.env` private.
2. Install the unified frontend's dependencies:

   ```powershell
   cd dashboard
   npm install
   ```

3. Start the combined app and API from the backend folder:

   ```powershell
   cd ../backend
   npm install
   npm start
   ```

Open `http://localhost:3002/` for the landing homepage and `http://localhost:3002/dashboard` for the trading dashboard. Express serves both frontend experiences through Vite middleware and handles the API on that same port. On first dashboard load the API adds sample holdings, positions, and the demo balance when they are missing.

Set `VITE_API_URL` for a deployed API URL. Set `CLIENT_ORIGIN` in the backend to the allowed browser origins as a comma-separated list. If MongoDB is unreachable, the API starts with temporary in-memory sample data; those demo changes reset when the backend restarts.

## Implemented API

- `GET /allHoldings`, `GET /allPositions`, `GET /allOrders`
- `POST /newOrder` with `name`, positive `qty`, positive `price`, and `mode` (`BUY` or `SELL`)
- `GET /api/funds`, `POST /api/funds/deposit`, `POST /api/funds/withdraw`
- `POST /api/signup` for demo account registration
- `POST /api/demo/seed` for idempotent sample data setup
- `GET /api/health`

Demo BUY orders reduce the simulated balance and add to holdings at a weighted average cost. SELL orders require an existing holding, increase the simulated balance, and reduce or remove that holding. Orders are stored with their status and timestamp.
