import React from "react";

function Hero() {
  return (
    <section className="conatainer-fluid" id="supportHero">
      <div className="p-5" id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="">Track Tickets</a>
      </div>
      <div className=" row p-5 m-3">
        <div className=" col-6 p-3">
          <h1 className="fs-3">
            search for an answer orr browse help topics to create a ticket{" "}
          </h1>
          <input placeholder="Eg.how di I activate F&O" />
          <br/>
          <a href="">Track account opening</a>
          <a href="">Track account activation</a>
          <a href="">Intraday margins</a>
          <a href=""> Kite user manual</a>
        </div>
        <div className=" col-6 p-3 ">
          <h1 className="fs-3">featured</h1>
          <ol>
            <li><a href="">Current Takeovers and Delisting - january</a></li>
            <li><a href="">Latest Intraday leverages = MIS & CO</a></li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
