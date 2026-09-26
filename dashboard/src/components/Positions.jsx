import React from "react";
import { useDashboardData } from "./DashboardData";

const Positions = () => {
  const { positions, loading, error } = useDashboardData();
  return <>
    <h3 className="title">Positions ({positions.length})</h3>
    {error && <p role="alert" className="error-message">{error}</p>}
    {loading ? <p>Positions load ho rahe hain…</p> : positions.length === 0 ? <p>Abhi koi open position nahi hai.</p> : <div className="order-table"><table>
      <thead><tr><th>Product</th><th>Instrument</th><th>Qty.</th><th>Avg.</th><th>LTP</th><th>P&amp;L</th><th>Chg.</th></tr></thead>
      <tbody>{positions.map((stock) => {
        const pnl = (stock.price - stock.avg) * stock.qty;
        return <tr key={stock._id || stock.name}><td>{stock.product}</td><td>{stock.name}</td><td>{stock.qty}</td><td>{Number(stock.avg).toFixed(2)}</td><td>{Number(stock.price).toFixed(2)}</td><td className={pnl >= 0 ? "profit" : "loss"}>{pnl.toFixed(2)}</td><td className={stock.isLoss ? "loss" : "profit"}>{stock.day || "—"}</td></tr>;
      })}</tbody>
    </table></div>}
  </>;
};

export default Positions;
