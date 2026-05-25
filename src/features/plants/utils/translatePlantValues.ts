import {
  EnvironmentTypeEnum,
  PlantPhaseEnum,
  SubstrateTypeEnum,
  SunlightExposureEnum,
} from "../models/plant.model";

export const phaseTranslations: Record<PlantPhaseEnum, string> = {
  [PlantPhaseEnum.SEED]: "Semente",
  [PlantPhaseEnum.GERMINATION]: "Germinação",
  [PlantPhaseEnum.VEGETATIVE]: "Vegetativo",
  [PlantPhaseEnum.FLOWERING]: "Floração",
  [PlantPhaseEnum.HARVEST]: "Colheita",
};

export const environmentTranslations: Record<EnvironmentTypeEnum, string> = {
  [EnvironmentTypeEnum.INDOOR]: "Ambiente Interno",
  [EnvironmentTypeEnum.OUTDOOR]: "Ambiente Externo",
  [EnvironmentTypeEnum.GREENHOUSE]: "Estufa",
};

export const sunlightTranslations: Record<SunlightExposureEnum, string> = {
  [SunlightExposureEnum.FULL_SUN]: "Sol Pleno",
  [SunlightExposureEnum.PARTIAL_SHADE]: "Meia Sombra",
  [SunlightExposureEnum.SHADOW]: "Sombra",
};

export const substrateTranslations: Record<SubstrateTypeEnum, string> = {
  [SubstrateTypeEnum.SOIL]: "Terra / Solo",
  [SubstrateTypeEnum.SANDY]: "Arenoso",
  [SubstrateTypeEnum.COCO_PEAT]: "Fibra de Coco",
  [SubstrateTypeEnum.HYDROPONIC]: "Hidropônico",
};
