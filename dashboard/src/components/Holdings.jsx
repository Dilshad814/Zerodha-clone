import React from "react";
import { VerticalGraph } from "./VerticalGraph";
import { useDashboardData } from "./DashboardData";

const money = (value) => Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Holdings = () => {
  const { holdings, loading, error } = useDashboardData();
  const investment = holdings.reduce((sum, stock) => sum + stock.avg * stock.qty, 0);
  const currentValue = holdings.reduce((sum, stock) => sum + stock.price * stock.qty, 0);
  const profitLoss = currentValue - investment;
  const labels = holdings.map((stock) => stock.name);
  const data = { labels, datasets: [{ label: "Stock Price", data: holdings.map((stock) => stock.price), backgroundColor: "rgba(255, 99, 132, 0.5)" }] };

  return <>
    <h3 className="title">Holdings ({holdings.length})</h3>
    {error && <p role="alert" className="error-message">{error}</p>}
    {loading ? <p>Holdings load ho rahe hain…</p> : holdings.length === 0 ? <p>Abhi koi holding nahi hai. Watchlist se demo order place karein.</p> : <>
      <div className="order-table"><table>
        <thead><tr><th>Instrument</th><th>Qty.</th><th>Avg. cost</th><th>LTP</th><th>Cur. val</th><th>P&amp;L</th><th>Net chg.</th><th>Day chg.</th></tr></thead>
        <tbody>{holdings.map((stock) => {
          const current = stock.price * stock.qty;
          const pnl = current - stock.avg * stock.qty;
          return <tr key={stock._id || stock.name}>
            <td>{stock.name}</td><td>{stock.qty}</td><td>{money(stock.avg)}</td><td>{money(stock.price)}</td><td>{money(current)}</td>
            <td className={pnl >= 0 ? "profit" : "loss"}>{money(pnl)}</td>
            <td className={pnl >= 0 ? "profit" : "loss"}>{stock.net || "—"}</td>
            <td className={stock.isLoss ? "loss" : "profit"}>{stock.day || "—"}</td>
          </tr>;
        })}</tbody>
      </table></div>
      <div className="row">
        <div className="col"><h5>₹{money(investment)}</h5><p>Total investment</p></div>
        <div className="col"><h5>₹{money(currentValue)}</h5><p>Current value</p></div>
        <div className="col"><h5 className={profitLoss >= 0 ? "profit" : "loss"}>₹{money(profitLoss)} ({investment ? ((profitLoss / investment) * 100).toFixed(2) : "0.00"}%)</h5><p>P&amp;L</p></div>
      </div>
      <VerticalGraph data={data} />
    </>}
  </>;
};

export default Holdings;
