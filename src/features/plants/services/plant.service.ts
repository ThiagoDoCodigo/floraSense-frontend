import { floraSenseApi } from "../../../services/floraSenseApi";
import type {
  Plant,
  SensorReading,
  PaginatedResponse,
} from "../models/plant.model";

class PlantService {
  async getPlants(
    page: number,
    limit: number = 10,
  ): Promise<PaginatedResponse<Plant>> {
    const { data } = await floraSenseApi.get<PaginatedResponse<Plant>>(
      `/plants?page=${page}&limit=${limit}`,
    );
    return data;
  }

  async getPlantById(id: string): Promise<Plant> {
    const { data } = await floraSenseApi.get<Plant>(`/plants/${id}`);
    return data;
  }

  async addPlant(payload: Partial<Plant>): Promise<Plant> {
    const { data } = await floraSenseApi.post<Plant>("/plants", payload);
    return data;
  }

  async updatePlant(id: string, payload: Partial<Plant>): Promise<Plant> {
    const { data } = await floraSenseApi.patch<Plant>(`/plants/${id}`, payload);
    return data;
  }

  async getPlantReadings(
    plantId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<SensorReading>> {
    const { data } = await floraSenseApi.get<PaginatedResponse<SensorReading>>(
      `/sensor-readings/plant/${plantId}?page=${page}&limit=${limit}`,
    );
    return data;
  }

  async connectESP32(
    plantId: string,
    payload: { macAddress: string; firmwareVersion?: string },
  ): Promise<Plant> {
    const { data } = await floraSenseApi.post<Plant>(
      `/plants/${plantId}/connect`,
      payload,
    );
    return data;
  }

  async disconnectESP32(plantId: string): Promise<Plant> {
    const { data } = await floraSenseApi.post<Plant>(
      `/plants/${plantId}/disconnect`,
    );
    return data;
  }

  async updateReadingInterval(
    plantId: string,
    intervalMinutes: number,
  ): Promise<void> {
    await floraSenseApi.patch(`/plants/${plantId}/interval`, {
      intervalMinutes,
    });
  }

  async forceReading(plantId: string): Promise<void> {
    await floraSenseApi.post(`/plants/${plantId}/force-reading`);
  }

  async triggerManualWatering(
    plantId: string,
    volumeMl: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (volumeMl <= 0 || volumeMl > 1000) {
          return reject(
            new Error("Volume inválido. Insira entre 1 e 1000 ml."),
          );
        }
        resolve();
      }, 1500);
    });
  }

  async updateESPConfig(plantId: string, interval: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (interval < 15) {
          return reject(
            new Error(
              "O intervalo mínimo de leitura é 15 minutos para poupar bateria.",
            ),
          );
        }
        resolve();
      }, 1500);
    });
  }
}

export default new PlantService();
