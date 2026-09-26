import React, { useState } from "react";
import { useDashboardData } from "./DashboardData";
import api, { getErrorMessage } from "./api";

const Funds = () => {
  const { funds, refreshData, error: dataError } = useDashboardData();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFunds = async (action) => {
    setMessage("");
    setError("");
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Kripya valid amount enter karein.");
      return;
    }
    setBusy(true);
    try {
      const response = await api.post(`/api/funds/${action}`, { amount: Number(amount) });
      setMessage(action === "deposit" ? "Demo funds add ho gaye." : "Demo funds withdraw ho gaye.");
      setAmount("");
      await refreshData();
      if (response.data?.balance === undefined) setError("Balance update nahi mil paya.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return <div className="funds-page">
    <div className="funds"><p>Demo account funds · No real money is used</p><strong>Available balance: ₹{Number(funds?.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
    {(error || dataError) && <p role="alert" className="error-message">{error || dataError}</p>}
    {message && <p role="status" className="success-message">{message}</p>}
    <div className="funds-actions">
      <label htmlFor="fund-amount">Amount (₹)</label>
      <input id="fund-amount" type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" />
      <button className="btn btn-green" type="button" disabled={busy} onClick={() => handleFunds("deposit")}>{busy ? "Please wait…" : "Add demo funds"}</button>
      <button className="btn btn-blue" type="button" disabled={busy} onClick={() => handleFunds("withdraw")}>Withdraw demo funds</button>
    </div>
    <p className="demo-note">This is a learning project. Deposits and withdrawals only change a simulated balance stored in the database.</p>
  </div>;
};

export default Funds;
