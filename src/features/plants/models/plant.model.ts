export enum PlantPhaseEnum {
  SEED = "SEED",
  GERMINATION = "GERMINATION",
  VEGETATIVE = "VEGETATIVE",
  FLOWERING = "FLOWERING",
  HARVEST = "HARVEST",
}

export enum EnvironmentTypeEnum {
  INDOOR = "INDOOR",
  OUTDOOR = "OUTDOOR",
  GREENHOUSE = "GREENHOUSE",
}

export enum SunlightExposureEnum {
  FULL_SUN = "FULL_SUN",
  PARTIAL_SHADE = "PARTIAL_SHADE",
  SHADOW = "SHADOW",
}

export enum SubstrateTypeEnum {
  SOIL = "SOIL",
  SANDY = "SANDY",
  COCO_PEAT = "COCO_PEAT",
  HYDROPONIC = "HYDROPONIC",
}

export interface Plant {
  id: string;
  userId: string;
  name: string;
  especie: string;
  phaseOfLife: PlantPhaseEnum;
  environmentType: EnvironmentTypeEnum;
  sunlightExposure: SunlightExposureEnum;
  substrateType: SubstrateTypeEnum;
  plantingDate?: string;
  imageUrl?: string;
  isConnected: boolean;
  macAddress: string | null;
  firmwareVersion: string | null;
  lastConnectionDate: string | null;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
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
  levelUrgent: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
  isRead: boolean;
  parametersIdeas: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ESPConfig {
  ssid: string;
  readingIntervalMinutes: number;
}

export interface PlantFormErrors {
  name?: string;
  especie?: string;
}

export interface ConnectDeviceDTO {
  macAddress: string;
  firmwareVersion?: string;
}
