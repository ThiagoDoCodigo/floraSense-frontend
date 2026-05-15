export interface DashboardSummary {
  totalPlants: number;
  healthyPlants: number;
  attentionNeeded: number;
  avgMoisture: number;
  avgTemperature: number;
}

export interface DashboardAlert {
  id: string;
  plantId: string;
  plantName: string;
  message: string;
  type: "warning" | "critical" | "info";
  timestamp: string;
  actionRequired: string;
}
