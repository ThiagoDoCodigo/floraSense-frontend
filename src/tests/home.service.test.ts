import dashboardService from  '../features/home/services/home.service';
import { floraSenseApi } from '../services/floraSenseApi';

jest.mock('../services/floraSenseApi', () => ({
  floraSenseApi: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Deve buscar os indicadores numéricos (summary) corretamente', async () => {
    const mockSummary = {
      totalPlants: 10,
      plantsInAttention: 2,
      averageSoilMoisture: 45,
      averageTemperature: 22,
    };
    (floraSenseApi.get as jest.Mock).mockResolvedValueOnce({ data: mockSummary });

    const result = await dashboardService.getIndicators();

    expect(floraSenseApi.get).toHaveBeenCalledWith('/plants/indicators/by-plants');
    expect(result).toEqual(mockSummary);
  });

  it('2. Deve buscar os alertas urgentes com paginação padrão', async () => {
    const mockAlertsResponse = { data: [], limit: 3, page: 1, totalPages: 1, total: 0 };
    (floraSenseApi.get as jest.Mock).mockResolvedValueOnce({ data: mockAlertsResponse });

    const result = await dashboardService.getUrgentAlerts();

    expect(floraSenseApi.get).toHaveBeenCalledWith('/sensor-readings/urgent?page=1&limit=3');
    expect(result).toEqual(mockAlertsResponse);
  });

  it('3. Deve enviar um PATCH para marcar a leitura como lida', async () => {
    (floraSenseApi.patch as jest.Mock).mockResolvedValueOnce({});

    await dashboardService.markAsRead('reading-123');

    expect(floraSenseApi.patch).toHaveBeenCalledWith('/sensor-readings/reading-123/read');
  });
});