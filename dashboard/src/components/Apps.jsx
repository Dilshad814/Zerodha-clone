import React from "react";

const tools = [
  { name: "Kite", category: "Trading", description: "Watch your demo watchlist and practice placing simulated orders." },
  { name: "Console", category: "Account overview", description: "Review the holdings, orders, and simulated balance saved in this project." },
  { name: "Coin", category: "Investing", description: "Mutual fund investing is not connected in this learning project." },
  { name: "Varsity", category: "Learn", description: "Use this space to note concepts you want to explore while learning markets." },
];

const Apps = () => <section className="apps-page">
  <h2>Apps &amp; tools</h2>
  <p className="demo-note">These are learning-project descriptions. This dashboard is not connected to Zerodha services.</p>
  <div className="apps-grid">{tools.map((tool) => <article className="app-card" key={tool.name}>
    <span>{tool.category}</span><h3>{tool.name}</h3><p>{tool.description}</p>
  </article>)}</div>
</section>;

export default Apps;
