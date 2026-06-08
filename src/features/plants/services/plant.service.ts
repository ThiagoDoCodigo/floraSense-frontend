import { floraSenseApi } from "../../../services/floraSenseApi";
import type {
  Plant,
  SensorReading,
  PaginatedResponse,
} from "../models/plant.model";
import { Platform } from "react-native";

class PlantService {
  async getPlants(params: {
    page: number;
    limit?: number;
    name?: string;
    especie?: string;
    phaseOfLife?: string;
  }): Promise<PaginatedResponse<Plant>> {
    const { page, limit = 10, name, especie, phaseOfLife } = params;

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (name) queryParams.append("name", name);
    if (especie) queryParams.append("especie", especie);
    if (phaseOfLife) queryParams.append("phaseOfLife", phaseOfLife);

    const { data } = await floraSenseApi.get<PaginatedResponse<Plant>>(
      `/plants?${queryParams.toString()}`,
    );
    return data;
  }

  async getPlantById(id: string): Promise<Plant> {
    const { data } = await floraSenseApi.get<Plant>(`/plants/${id}`);
    return data;
  }

  async addPlant(
    payload: Partial<Plant>,
    localImageUri?: string,
  ): Promise<Plant> {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (payload[key as keyof Plant] !== undefined) {
        formData.append(key, String(payload[key as keyof Plant]));
      }
    });

    if (localImageUri) {
      const filename = localImageUri.split("/").pop() || "plant.jpg";
      formData.append("file", {
        uri:
          Platform.OS === "android"
            ? localImageUri
            : localImageUri.replace("file://", ""),
        name: filename,
        type: "image/jpeg",
      } as any);
    }

    const { data } = await floraSenseApi.post<Plant>("/plants", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => formData,
    });
    return data;
  }

  async updatePlant(
    id: string,
    payload: Partial<Plant>,
    localImageUri?: string,
  ): Promise<Plant> {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (payload[key as keyof Plant] !== undefined) {
        formData.append(key, String(payload[key as keyof Plant]));
      }
    });

    if (localImageUri) {
      const filename = localImageUri.split("/").pop() || "plant.jpg";
      formData.append("file", {
        uri:
          Platform.OS === "android"
            ? localImageUri
            : localImageUri.replace("file://", ""),
        name: filename,
        type: "image/jpeg",
      } as any);
    }

    const { data } = await floraSenseApi.patch<Plant>(
      `/plants/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => formData,
      },
    );
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
}

export default new PlantService();
