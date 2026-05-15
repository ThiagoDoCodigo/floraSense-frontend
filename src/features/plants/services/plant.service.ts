import type {
  Plant,
  SensorReading,
  PaginatedResponse,
} from "../models/plant.model";

const MOCK_PLANTS: Plant[] = [
  {
    id: "plant_1",
    name: "Costela-de-Adão Sala",
    species: "Monstera",
    scientificName: "Monstera deliciosa",
    imageUrl:
      "https://images.unsplash.com/photo-1545241047-6083a36ee15f?w=500&q=80",
    idealMoistureMin: 40,
    idealMoistureMax: 60,
    createdAt: "2026-04-10T08:00:00.000Z",
  },
  {
    id: "plant_2",
    name: "Samambaia Varanda",
    species: "Samambaia",
    scientificName: "Nephrolepis exaltata",
    imageUrl:
      "https://images.unsplash.com/photo-1597551061994-0130dbfa66b2?w=500&q=80",
    idealMoistureMin: 60,
    idealMoistureMax: 80,
    createdAt: "2026-04-12T09:30:00.000Z",
  },
  {
    id: "plant_3",
    name: "Zamioculca Quarto",
    species: "Zamioculcas",
    scientificName: "Zamioculcas zamiifolia",
    imageUrl:
      "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=500&q=80",
    idealMoistureMin: 20,
    idealMoistureMax: 40,
    createdAt: "2026-04-15T10:15:00.000Z",
  },
  {
    id: "plant_4",
    name: "Espada de São Jorge",
    species: "Sansevieria",
    scientificName: "Sansevieria trifasciata",
    imageUrl:
      "https://images.unsplash.com/photo-1599009585640-5f25eb3a1c8b?w=500&q=80",
    idealMoistureMin: 15,
    idealMoistureMax: 30,
    createdAt: "2026-04-18T14:20:00.000Z",
  },
  {
    id: "plant_5",
    name: "Jiboia Cozinha",
    species: "Jiboia",
    scientificName: "Epipremnum aureum",
    imageUrl:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
    idealMoistureMin: 50,
    idealMoistureMax: 70,
    createdAt: "2026-04-20T11:45:00.000Z",
  },
  {
    id: "plant_6",
    name: "Ficus Lyrata Escritório",
    species: "Ficus",
    scientificName: "Ficus lyrata",
    imageUrl:
      "https://images.unsplash.com/photo-1605553181829-020583b28b74?w=500&q=80",
    idealMoistureMin: 45,
    idealMoistureMax: 65,
    createdAt: "2026-04-22T16:10:00.000Z",
  },
  {
    id: "plant_7",
    name: "Maranta Pavão",
    species: "Maranta",
    scientificName: "Maranta leuconeura",
    imageUrl:
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80",
    idealMoistureMin: 60,
    idealMoistureMax: 80,
    createdAt: "2026-04-25T09:05:00.000Z",
  },
  {
    id: "plant_8",
    name: "Peperômia Banheiro",
    species: "Peperomia",
    scientificName: "Peperomia obtusifolia",
    imageUrl:
      "https://images.unsplash.com/photo-1613214149922-f1809fdcfbf6?w=500&q=80",
    idealMoistureMin: 40,
    idealMoistureMax: 60,
    createdAt: "2026-04-28T13:30:00.000Z",
  },
  {
    id: "plant_9",
    name: "Calathea Orbifolia",
    species: "Calathea",
    scientificName: "Calathea orbifolia",
    imageUrl:
      "https://images.unsplash.com/photo-1620127393438-fb9e2c695b22?w=500&q=80",
    idealMoistureMin: 65,
    idealMoistureMax: 85,
    createdAt: "2026-05-01T10:50:00.000Z",
  },
  {
    id: "plant_10",
    name: "Alocasia Polly",
    species: "Alocasia",
    scientificName: "Alocasia amazonica",
    imageUrl:
      "https://images.unsplash.com/photo-1623861205315-993d0c2e391b?w=500&q=80",
    idealMoistureMin: 55,
    idealMoistureMax: 75,
    createdAt: "2026-05-03T08:15:00.000Z",
  },
];

const MOCK_READINGS: Record<string, SensorReading[]> = {
  plant_1: [
    {
      id: "r1_1",
      plantId: "plant_1",
      timestamp: "2026-05-03T20:00:00.000Z",
      soilMoisture: 38,
      temperature: 24,
      airHumidity: 60,
      nitrogen: 12,
      phosphorus: 15,
      potassium: 18,
      aiDiagnosis:
        "Umidade do solo ligeiramente abaixo do ideal. Folhas apresentam leve opacidade.",
      actionRecommended: "Regar com 150ml de água.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=500&q=80",
    },
    {
      id: "r1_2",
      plantId: "plant_1",
      timestamp: "2026-05-03T14:00:00.000Z",
      soilMoisture: 42,
      temperature: 26,
      airHumidity: 55,
      nitrogen: 12,
      phosphorus: 15,
      potassium: 18,
      aiDiagnosis:
        "Parâmetros normais. A planta está saudável e realizando fotossíntese adequadamente.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=500&q=80",
    },
    {
      id: "r1_3",
      plantId: "plant_1",
      timestamp: "2026-05-03T08:00:00.000Z",
      soilMoisture: 45,
      temperature: 22,
      airHumidity: 65,
      nitrogen: 13,
      phosphorus: 16,
      potassium: 19,
      aiDiagnosis: "Condições excelentes para o início do dia.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=500&q=80",
    },
  ],
  plant_2: [
    {
      id: "r2_1",
      plantId: "plant_2",
      timestamp: "2026-05-03T19:30:00.000Z",
      soilMoisture: 55,
      temperature: 23,
      airHumidity: 70,
      nitrogen: 10,
      phosphorus: 12,
      potassium: 14,
      aiDiagnosis: "Nitrogênio baixo. Pontas das frondes começam a secar.",
      actionRecommended: "Aplicar fertilizante rico em nitrogênio diluído.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1597551061994-0130dbfa66b2?w=500&q=80",
    },
    {
      id: "r2_2",
      plantId: "plant_2",
      timestamp: "2026-05-03T13:30:00.000Z",
      soilMoisture: 58,
      temperature: 25,
      airHumidity: 68,
      nitrogen: 10,
      phosphorus: 12,
      potassium: 14,
      aiDiagnosis: "Umidade caindo para o limite inferior ideal desta espécie.",
      actionRecommended: "Preparar para rega no fim do dia.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1597551061994-0130dbfa66b2?w=500&q=80",
    },
    {
      id: "r2_3",
      plantId: "plant_2",
      timestamp: "2026-05-03T07:30:00.000Z",
      soilMoisture: 62,
      temperature: 21,
      airHumidity: 75,
      nitrogen: 11,
      phosphorus: 13,
      potassium: 15,
      aiDiagnosis: "Alta umidade relativa do ar beneficiando a espécie.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1597551061994-0130dbfa66b2?w=500&q=80",
    },
  ],
  plant_3: [
    {
      id: "r3_1",
      plantId: "plant_3",
      timestamp: "2026-05-03T19:00:00.000Z",
      soilMoisture: 25,
      temperature: 25,
      airHumidity: 50,
      nitrogen: 8,
      phosphorus: 10,
      potassium: 12,
      aiDiagnosis:
        "Solo seco, ideal para Zamioculcas. Sem sinais de podridão radicular.",
      actionRecommended: "Manter sem rega.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=500&q=80",
    },
    {
      id: "r3_2",
      plantId: "plant_3",
      timestamp: "2026-05-03T13:00:00.000Z",
      soilMoisture: 26,
      temperature: 27,
      airHumidity: 45,
      nitrogen: 8,
      phosphorus: 10,
      potassium: 12,
      aiDiagnosis: "Temperatura ambiente ligeiramente elevada, mas tolerável.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=500&q=80",
    },
    {
      id: "r3_3",
      plantId: "plant_3",
      timestamp: "2026-05-03T07:00:00.000Z",
      soilMoisture: 27,
      temperature: 23,
      airHumidity: 55,
      nitrogen: 8,
      phosphorus: 10,
      potassium: 12,
      aiDiagnosis: "Planta em dormência saudável.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=500&q=80",
    },
  ],
  plant_4: [
    {
      id: "r4_1",
      plantId: "plant_4",
      timestamp: "2026-05-03T18:45:00.000Z",
      soilMoisture: 18,
      temperature: 24,
      airHumidity: 40,
      nitrogen: 5,
      phosphorus: 5,
      potassium: 8,
      aiDiagnosis:
        "Baixa exigência hídrica confirmada. Folhas firmes e eretas.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1599009585640-5f25eb3a1c8b?w=500&q=80",
    },
    {
      id: "r4_2",
      plantId: "plant_4",
      timestamp: "2026-05-03T12:45:00.000Z",
      soilMoisture: 19,
      temperature: 26,
      airHumidity: 38,
      nitrogen: 5,
      phosphorus: 5,
      potassium: 8,
      aiDiagnosis: "Condições ótimas. Sem indícios de fungos.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1599009585640-5f25eb3a1c8b?w=500&q=80",
    },
    {
      id: "r4_3",
      plantId: "plant_4",
      timestamp: "2026-05-03T06:45:00.000Z",
      soilMoisture: 20,
      temperature: 21,
      airHumidity: 45,
      nitrogen: 5,
      phosphorus: 5,
      potassium: 8,
      aiDiagnosis: "Período noturno concluído sem variações extremas.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1599009585640-5f25eb3a1c8b?w=500&q=80",
    },
  ],
  plant_5: [
    {
      id: "r5_1",
      plantId: "plant_5",
      timestamp: "2026-05-03T18:30:00.000Z",
      soilMoisture: 48,
      temperature: 26,
      airHumidity: 65,
      nitrogen: 15,
      phosphorus: 12,
      potassium: 18,
      aiDiagnosis: "Folhas novas detectadas. Leve estresse hídrico inicial.",
      actionRecommended: "Regar com 100ml.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
    },
    {
      id: "r5_2",
      plantId: "plant_5",
      timestamp: "2026-05-03T12:30:00.000Z",
      soilMoisture: 52,
      temperature: 28,
      airHumidity: 60,
      nitrogen: 15,
      phosphorus: 12,
      potassium: 18,
      aiDiagnosis: "Clima quente propiciando crescimento rápido.",
      actionRecommended: "Monitorar umidade ao fim do dia.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
    },
    {
      id: "r5_3",
      plantId: "plant_5",
      timestamp: "2026-05-03T06:30:00.000Z",
      soilMoisture: 55,
      temperature: 24,
      airHumidity: 70,
      nitrogen: 16,
      phosphorus: 13,
      potassium: 19,
      aiDiagnosis: "Absorção de nutrientes estabilizada durante a noite.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
    },
  ],
  plant_6: [
    {
      id: "r6_1",
      plantId: "plant_6",
      timestamp: "2026-05-03T18:15:00.000Z",
      soilMoisture: 50,
      temperature: 23,
      airHumidity: 55,
      nitrogen: 20,
      phosphorus: 15,
      potassium: 25,
      aiDiagnosis: "Planta saudável. Folhas limpas e sem manchas marrons.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1605553181829-020583b28b74?w=500&q=80",
    },
    {
      id: "r6_2",
      plantId: "plant_6",
      timestamp: "2026-05-03T12:15:00.000Z",
      soilMoisture: 54,
      temperature: 25,
      airHumidity: 50,
      nitrogen: 20,
      phosphorus: 15,
      potassium: 25,
      aiDiagnosis: "Luz indireta adequada captada pelas folhas.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1605553181829-020583b28b74?w=500&q=80",
    },
    {
      id: "r6_3",
      plantId: "plant_6",
      timestamp: "2026-05-03T06:15:00.000Z",
      soilMoisture: 58,
      temperature: 21,
      airHumidity: 60,
      nitrogen: 21,
      phosphorus: 16,
      potassium: 26,
      aiDiagnosis: "Níveis de potássio ótimos para rigidez do caule.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1605553181829-020583b28b74?w=500&q=80",
    },
  ],
  plant_7: [
    {
      id: "r7_1",
      plantId: "plant_7",
      timestamp: "2026-05-03T18:00:00.000Z",
      soilMoisture: 65,
      temperature: 25,
      airHumidity: 75,
      nitrogen: 14,
      phosphorus: 18,
      potassium: 20,
      aiDiagnosis:
        "As folhas se fecharam conforme o ciclo circadiano. Umidade excelente.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80",
    },
    {
      id: "r7_2",
      plantId: "plant_7",
      timestamp: "2026-05-03T12:00:00.000Z",
      soilMoisture: 68,
      temperature: 27,
      airHumidity: 65,
      nitrogen: 14,
      phosphorus: 18,
      potassium: 20,
      aiDiagnosis:
        "Bordas das folhas levemente enroladas devido ao pico de calor.",
      actionRecommended:
        "Borrifar água nas folhas se a umidade do ar cair mais.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80",
    },
    {
      id: "r7_3",
      plantId: "plant_7",
      timestamp: "2026-05-03T06:00:00.000Z",
      soilMoisture: 72,
      temperature: 22,
      airHumidity: 80,
      nitrogen: 15,
      phosphorus: 19,
      potassium: 21,
      aiDiagnosis: "Abertura das folhas iniciada com sucesso.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80",
    },
  ],
  plant_8: [
    {
      id: "r8_1",
      plantId: "plant_8",
      timestamp: "2026-05-03T17:45:00.000Z",
      soilMoisture: 45,
      temperature: 24,
      airHumidity: 70,
      nitrogen: 12,
      phosphorus: 14,
      potassium: 16,
      aiDiagnosis: "Crescimento denso e coloração viva detectados.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1613214149922-f1809fdcfbf6?w=500&q=80",
    },
    {
      id: "r8_2",
      plantId: "plant_8",
      timestamp: "2026-05-03T11:45:00.000Z",
      soilMoisture: 48,
      temperature: 26,
      airHumidity: 68,
      nitrogen: 12,
      phosphorus: 14,
      potassium: 16,
      aiDiagnosis: "Solo retendo umidade corretamente.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1613214149922-f1809fdcfbf6?w=500&q=80",
    },
    {
      id: "r8_3",
      plantId: "plant_8",
      timestamp: "2026-05-03T05:45:00.000Z",
      soilMoisture: 50,
      temperature: 23,
      airHumidity: 75,
      nitrogen: 12,
      phosphorus: 14,
      potassium: 16,
      aiDiagnosis: "Condições do banheiro perfeitas para a espécie.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1613214149922-f1809fdcfbf6?w=500&q=80",
    },
  ],
  plant_9: [
    {
      id: "r9_1",
      plantId: "plant_9",
      timestamp: "2026-05-03T17:30:00.000Z",
      soilMoisture: 70,
      temperature: 24,
      airHumidity: 80,
      nitrogen: 18,
      phosphorus: 20,
      potassium: 22,
      aiDiagnosis:
        "Alta necessidade hídrica suprida. Sem marcas de secura nas margens.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1620127393438-fb9e2c695b22?w=500&q=80",
    },
    {
      id: "r9_2",
      plantId: "plant_9",
      timestamp: "2026-05-03T11:30:00.000Z",
      soilMoisture: 75,
      temperature: 26,
      airHumidity: 75,
      nitrogen: 18,
      phosphorus: 20,
      potassium: 22,
      aiDiagnosis: "Temperatura ideal para manter o padrão das folhas.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1620127393438-fb9e2c695b22?w=500&q=80",
    },
    {
      id: "r9_3",
      plantId: "plant_9",
      timestamp: "2026-05-03T05:30:00.000Z",
      soilMoisture: 80,
      temperature: 22,
      airHumidity: 85,
      nitrogen: 19,
      phosphorus: 21,
      potassium: 23,
      aiDiagnosis: "Leituras estáveis. Evitar rega para prevenir fungos.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1620127393438-fb9e2c695b22?w=500&q=80",
    },
  ],
  plant_10: [
    {
      id: "r10_1",
      plantId: "plant_10",
      timestamp: "2026-05-03T17:15:00.000Z",
      soilMoisture: 58,
      temperature: 25,
      airHumidity: 70,
      nitrogen: 22,
      phosphorus: 18,
      potassium: 24,
      aiDiagnosis:
        "Fósforo levemente baixo. Coloração das nervuras ainda preservada.",
      actionRecommended: "Planejar adubação fosfatada na próxima semana.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1623861205315-993d0c2e391b?w=500&q=80",
    },
    {
      id: "r10_2",
      plantId: "plant_10",
      timestamp: "2026-05-03T11:15:00.000Z",
      soilMoisture: 62,
      temperature: 27,
      airHumidity: 65,
      nitrogen: 22,
      phosphorus: 18,
      potassium: 24,
      aiDiagnosis: "Planta recebendo luminosidade indireta adequada.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1623861205315-993d0c2e391b?w=500&q=80",
    },
    {
      id: "r10_3",
      plantId: "plant_10",
      timestamp: "2026-05-03T05:15:00.000Z",
      soilMoisture: 65,
      temperature: 23,
      airHumidity: 75,
      nitrogen: 23,
      phosphorus: 19,
      potassium: 25,
      aiDiagnosis: "Rizoma saudável, absorção hídrica em ritmo normal.",
      actionRecommended: "Nenhuma ação necessária.",
      leafImageUrl:
        "https://images.unsplash.com/photo-1623861205315-993d0c2e391b?w=500&q=80",
    },
  ],
};

class PlantService {
  async getPlants(
    page: number,
    limit: number = 5,
  ): Promise<PaginatedResponse<Plant>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const data = MOCK_PLANTS.slice(startIndex, endIndex);

        resolve({
          data,
          total: MOCK_PLANTS.length,
          page,
          totalPages: Math.ceil(MOCK_PLANTS.length / limit),
        });
      }, 800);
    });
  }

  async getPlantById(id: string): Promise<Plant> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plant = MOCK_PLANTS.find((p) => p.id === id);
        if (plant) resolve(plant);
        else reject(new Error("Planta não encontrada"));
      }, 500);
    });
  }

  async updatePlant(id: string, data: Partial<Plant>): Promise<Plant> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...MOCK_PLANTS.find((p) => p.id === id)!, ...data });
      }, 800);
    });
  }

  async getPlantReadings(plantId: string): Promise<SensorReading[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_READINGS[plantId] || []);
      }, 800);
    });
  }

  async addPlant(data: {
    name: string;
    species: string;
    imageUrl?: string;
  }): Promise<Plant> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!data.name || !data.species) {
          reject(new Error("Dados incompletos para cadastro."));
          return;
        }

        const newPlant: Plant = {
          id: `plant_${Date.now()}`,
          name: data.name,
          species: data.species,
          scientificName: "Aguardando Análise IA...",
          imageUrl:
            data.imageUrl ||
            "https://images.unsplash.com/photo-1545241047-6083a36ee15f?w=500&q=80",
          idealMoistureMin: 40,
          idealMoistureMax: 60,
          createdAt: new Date().toISOString(),
        };

        MOCK_PLANTS.unshift(newPlant);
        resolve(newPlant);
      }, 1000);
    });
  }

  async pairESP32(
    plantId: string,
    ssid: string,
    password: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!ssid || !password) {
          reject(new Error("Rede Wi-Fi e senha são obrigatórios."));
          return;
        }
        resolve();
      }, 2500);
    });
  }

  async triggerManualWatering(
    plantId: string,
    volumeMl: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (volumeMl <= 0 || volumeMl > 1000) {
          reject(new Error("Volume inválido. Insira entre 1 e 1000 ml."));
          return;
        }
        resolve();
      }, 1500);
    });
  }

  async updateESPConfig(plantId: string, interval: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (interval < 15) {
          reject(
            new Error(
              "O intervalo mínimo de leitura é 15 minutos para poupar bateria.",
            ),
          );
          return;
        }
        resolve();
      }, 1500);
    });
  }
}

export default new PlantService();
