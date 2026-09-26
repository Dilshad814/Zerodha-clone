import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../frontend/src/landing_page/Navbar";
import Footer from "../../frontend/src/landing_page/Footer";
import "../../frontend/src/index.css";

export default function LandingSite() {
  return <>
    <Navbar />
    <Outlet />
    <Footer />
  </>;
}
