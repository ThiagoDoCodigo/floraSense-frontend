export interface Plant {
  id: string;
  name: string;
  species: string;
  scientificName: string;
  imageUrl: string;
  idealMoistureMin: number;
  idealMoistureMax: number;
  createdAt: string;
}

export interface SensorReading {
  id: string;
  plantId: string;
  timestamp: string;
  soilMoisture: number;
  temperature: number;
  airHumidity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  aiDiagnosis: string;
  actionRecommended: string;
  leafImageUrl: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ESPConfig {
  ssid: string;
  readingIntervalMinutes: number;
}

export interface PlantFormErrors {
  name?: string;
  species?: string;
}
