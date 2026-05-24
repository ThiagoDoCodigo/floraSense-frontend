export interface DashboardSummary {
  totalPlants: number;
  plantsInAttention: number;
  averageSoilMoisture: number;
  averageTemperature: number;
}

export type LevelUrgentEnum = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface DashboardAlert {
  id: string;
  plantId: string;
  soilMoisture: number;
  temperature: number;
  airHumidity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  aiDiagnosis: string;
  actionRecommended: string;
  isUrgent: boolean;
  levelUrgent: LevelUrgentEnum | null;
  isRead: boolean;
  parametersIdeas: string | null;
  created_at: string;
  plant?: {
    id: string;
    name: string;
  };
}

export interface PaginatedAlertsResponse {
  data: DashboardAlert[];
  limit: number;
  page: number;
  totalPages: number;
  total: number;
}
