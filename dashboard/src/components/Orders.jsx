import React from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "./DashboardData";

const Orders = () => {
  const { orders, loading, error } = useDashboardData();
  return <div className="orders">
    <h3 className="title">Orders ({orders.length})</h3>
    {error && <p role="alert" className="error-message">{error}</p>}
    {loading ? <p>Orders load ho rahe hain…</p> : orders.length === 0 ? <div className="no-orders"><p>Aaj abhi tak koi order place nahi hua.</p><Link to="/" className="btn">Get started</Link></div> : <div className="order-table"><table>
      <thead><tr><th>Time</th><th>Instrument</th><th>Type</th><th>Product</th><th>Qty.</th><th>Price</th><th>Status</th></tr></thead>
      <tbody>{orders.map((order) => <tr key={order._id}>
        <td>{new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</td>
        <td>{order.name}</td><td className={order.mode === "BUY" ? "profit" : "loss"}>{order.mode}</td>
        <td>{order.product || "CNC"}</td><td>{order.qty}</td><td>₹{Number(order.price).toFixed(2)}</td><td>{order.status}</td>
      </tr>)}</tbody>
    </table></div>}
  </div>;
};

export default Orders;
