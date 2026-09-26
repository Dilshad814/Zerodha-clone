import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">Open a Zerodha account</h1>
        <p>
          Modern platforms and apps, ₹0 investment, and flat ₹20 intraday and
          F&O trades.
        </p>
        <Link
          to="/signup"
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          Signup Now
        </Link>
        <Link to="/dashboard" className="btn btn-outline-primary mt-2" style={{ width: "20%", margin: "0 auto" }}>
          Open demo dashboard
        </Link>
      </div>
    </div>
  );
}

export default OpenAccount;
