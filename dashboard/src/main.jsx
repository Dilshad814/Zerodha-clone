import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import LandingSite from "./LandingSite";
import HomePage from "../../frontend/src/landing_page/home/HomePage";
import Signup from "../../frontend/src/landing_page/signup/Signup";
import AboutPage from "../../frontend/src/landing_page/about/AboutPage";
import ProductPage from "../../frontend/src/landing_page/products/ProductsPage";
import PricingPage from "../../frontend/src/landing_page/pricing/PricingPage";
import SupportPage from "../../frontend/src/landing_page/support/SupportPage";
import NotFound from "../../frontend/src/landing_page/NotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard/*" element={<Home />} />
        <Route element={<LandingSite />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
