import React from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "./DashboardData";

const money = (value) => Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Summary = () => {
  const { holdings, funds, loading, error } = useDashboardData();
  const investment = holdings.reduce((sum, stock) => sum + stock.avg * stock.qty, 0);
  const currentValue = holdings.reduce((sum, stock) => sum + stock.price * stock.qty, 0);
  const pnl = currentValue - investment;
  return <>
    <div className="username"><h6>Hi, Trader!</h6><hr className="divider" /></div>
    {error && <p role="alert" className="error-message">{error}</p>}
    <div className="section"><span><p>Equity</p></span><div className="data">
      <div className="first"><h3>₹{loading ? "—" : money(funds?.balance)}</h3><p>Available demo funds</p></div><hr />
      <div className="second"><p>Holdings value <span>₹{money(currentValue)}</span></p><p>Open positions <span>{holdings.length}</span></p></div>
    </div><hr className="divider" /></div>
    <div className="section"><span><p>Holdings ({holdings.length})</p></span><div className="data">
      <div className="first"><h3 className={pnl >= 0 ? "profit" : "loss"}>₹{money(pnl)} <small>{investment ? `${((pnl / investment) * 100).toFixed(2)}%` : "0.00%"}</small></h3><p>Unrealized P&amp;L</p></div><hr />
      <div className="second"><p>Current value <span>₹{money(currentValue)}</span></p><p>Investment <span>₹{money(investment)}</span></p></div>
    </div><hr className="divider" /></div>
    <Link className="btn" to="/holdings">View holdings</Link>
  </>;
};

export default Summary;
