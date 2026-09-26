import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { getErrorMessage } from "./api";

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = useCallback(async () => {
    try {
      setError("");
      const [holdingsRes, positionsRes, ordersRes, fundsRes] = await Promise.all([
        api.get("/allHoldings"), api.get("/allPositions"), api.get("/allOrders"), api.get("/api/funds"),
      ]);
      setHoldings(holdingsRes.data);
      setPositions(positionsRes.data);
      setOrders(ordersRes.data);
      setFunds(fundsRes.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.post("/api/demo/seed").catch(() => {}).finally(() => {
      if (active) refreshData();
    });
    return () => { active = false; };
  }, [refreshData]);

  const value = { holdings, positions, orders, funds, loading, error, setError, refreshData };
  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error("useDashboardData must be used inside DashboardDataProvider");
  return context;
}
