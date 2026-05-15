import { useState, useEffect, useCallback } from "react";
import dashboardService from "../services/home.service";
import type { DashboardSummary, DashboardAlert } from "../models/home.model";

export const useDashboardViewModel = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [summaryData, alertsData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRecentAlerts(),
      ]);
      setSummary(summaryData);
      setAlerts(alertsData);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar o dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    loadDashboardData(true);
  };

  return {
    summary,
    alerts,
    loading,
    refreshing,
    error,
    onRefresh,
    clearError: () => setError(""),
  };
};
