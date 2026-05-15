import type { DashboardSummary, DashboardAlert } from "../models/home.model";

const MOCK_SUMMARY: DashboardSummary = {
  totalPlants: 10,
  healthyPlants: 8,
  attentionNeeded: 2,
  avgMoisture: 48,
  avgTemperature: 24,
};

const MOCK_ALERTS: DashboardAlert[] = [
  {
    id: "alert_1",
    plantId: "plant_10",
    plantName: "Alocasia Polly",
    message: "Nível de fósforo abaixo do ideal para a fase atual.",
    type: "warning",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actionRequired: "Adubação Fosfatada",
  },
  {
    id: "alert_2",
    plantId: "plant_3",
    plantName: "Zamioculca Quarto",
    message: "Solo extremamente seco. Risco de estresse hídrico se prolongado.",
    type: "critical",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actionRequired: "Regar imediatamente",
  },
];

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SUMMARY), 800);
    });
  }

  async getRecentAlerts(): Promise<DashboardAlert[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ALERTS), 1000);
    });
  }
}

export default new DashboardService();
