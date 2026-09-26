import React, { useContext, useState } from "react";
import GeneralContext from "./GeneralContext";
import { useDashboardData } from "./DashboardData";
import api, { getErrorMessage } from "./api";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode = "BUY" }) => {
  const generalContext = useContext(GeneralContext);
  const { refreshData, funds } = useDashboardData();
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const quantity = Number(stockQuantity);
    const price = Number(stockPrice);
    if (!Number.isInteger(quantity) || quantity <= 0 || !Number.isFinite(price) || price <= 0) {
      setError("Quantity aur price zero se zyada hone chahiye.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/newOrder", { name: uid, qty: quantity, price, mode, product: "CNC" });
      await refreshData();
      generalContext.closeBuyWindow();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="buy-action-window" id="buy-window">
    <form className="regular-order" onSubmit={handleSubmit}>
      <div className="inputs">
        <h3>{mode === "BUY" ? "Buy" : "Sell"} {uid}</h3>
        <fieldset><legend>Qty.</legend><input type="number" min="1" step="1" value={stockQuantity} onChange={(event) => setStockQuantity(event.target.value)} required /></fieldset>
        <fieldset><legend>Price</legend><input type="number" min="0.01" step="0.05" value={stockPrice} onChange={(event) => setStockPrice(event.target.value)} placeholder="Enter price" required /></fieldset>
      </div>
      {error && <p role="alert" className="error-message">{error}</p>}
      <div className="buttons">
        <span>{mode === "BUY" ? `Available demo funds ₹${Number(funds?.balance || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "Demo sell order"}</span>
        <div>
          <button type="submit" className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`} disabled={submitting}>{submitting ? "Submitting…" : mode}</button>
          <button type="button" className="btn btn-grey" onClick={generalContext.closeBuyWindow}>Cancel</button>
        </div>
      </div>
    </form>
  </div>;
};

export default BuyActionWindow;
