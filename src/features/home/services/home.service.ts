import { floraSenseApi } from "../../../services/floraSenseApi";
import type {
  DashboardSummary,
  PaginatedAlertsResponse,
} from "../models/home.model";

class DashboardService {
  public async getIndicators(): Promise<DashboardSummary> {
    const { data } = await floraSenseApi.get<DashboardSummary>(
      "/plants/indicators/by-plants",
    );
    return data;
  }

  public async getUrgentAlerts(
    page: number = 1,
    limit: number = 3,
  ): Promise<PaginatedAlertsResponse> {
    const { data } = await floraSenseApi.get<PaginatedAlertsResponse>(
      `/sensor-readings/urgent?page=${page}&limit=${limit}`,
    );
    return data;
  }

  public async markAsRead(readingId: string): Promise<void> {
    await floraSenseApi.patch(`/sensor-readings/${readingId}/read`);
  }
}

export default new DashboardService();
