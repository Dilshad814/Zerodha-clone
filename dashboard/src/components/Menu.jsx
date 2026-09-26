import React from "react";

import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const { pathname } = useLocation();
  const menuClass = (path) => `menu${pathname === path ? " selected" : ""}`;

  return (
    <div className="menu-container">
      <img src="/media/images/logo.svg" alt="Zerodha" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard"
            >
              <p className={menuClass("/dashboard")}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/orders"
            >
              <p className={menuClass("/dashboard/orders")}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/holdings"
            >
              <p className={menuClass("/dashboard/holdings")}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/positions"
            >
              <p className={menuClass("/dashboard/positions")}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/funds"
            >
              <p className={menuClass("/dashboard/funds")}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/dashboard/apps"
            >
              <p className={menuClass("/dashboard/apps")}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile">
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </div>
        
      </div>
    </div>
  );
};

export default Menu;
