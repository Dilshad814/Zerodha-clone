import React from "react";

function Brokrage() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 text-center  border-top">
        <div className="col-8 p-4">
          <a href="" style={{ textDecoration: "none" }}>
            <h3 className="fs-5">Brokerage calculator</h3>
            </a>
            <ul  style={{textAlign:"left", lineHeight:"2.4" , fontSize:"14px"}}
            className="text-muted"
            >
              <li>Call & trade and RMS auto-squareoff: Additional charges of ₹50 + GST per order</li>
              <li>Digital conatct notes will be sent via e-mail</li>
              <li>Physical copies of conytract notes, if required,shall be ₹20 per contact note.Courier charges apply</li>
              <li>For NRI account (non-PSI),0.5% or ₹100 per executed order for equity(whichever is lower).</li>
              <li>For NRI account (PSI),,0.5% or ₹200 per executed order for equity(whichever is lower).</li>
              <li>If the account is in debit balance, any order placed will be charged 40 per executed order of ₹20 per executed order.</li>
            </ul>
        </div>
        <div className="col-4 p-4">
          <a href="" style={{ textDecoration: "none" }}>
            <h3 className="fs-5">List of charges</h3>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Brokrage;
