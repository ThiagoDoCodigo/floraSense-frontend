import { getDBConnection } from "../connection";
import { SensorReading } from "../../features/plants/models/plant.model";

export const ReadingRepository = {
  async upsert(readings: SensorReading[]) {
    if (readings.length === 0) return;
    const db = await getDBConnection();
    if (!db) return [];

    const statement = await db.prepareAsync(`
      INSERT INTO sensor_readings (id, plantId, soilMoisture, temperature, airHumidity, nitrogen, phosphorus, potassium, aiDiagnosis, actionRecommended, isUrgent, levelUrgent, isRead, parametersIdeas, created_at, updated_at)
      VALUES ($id, $plantId, $soilMoisture, $temperature, $airHumidity, $nitrogen, $phosphorus, $potassium, $aiDiagnosis, $actionRecommended, $isUrgent, $levelUrgent, $isRead, $parametersIdeas, $created_at, $updated_at)
      ON CONFLICT(id) DO UPDATE SET
        soilMoisture = excluded.soilMoisture,
        temperature = excluded.temperature,
        airHumidity = excluded.airHumidity,
        nitrogen = excluded.nitrogen,
        phosphorus = excluded.phosphorus,
        potassium = excluded.potassium,
        aiDiagnosis = excluded.aiDiagnosis,
        actionRecommended = excluded.actionRecommended,
        isUrgent = excluded.isUrgent,
        levelUrgent = excluded.levelUrgent,
        isRead = excluded.isRead,
        parametersIdeas = excluded.parametersIdeas,
        updated_at = excluded.updated_at;
    `);

    try {
      for (const r of readings) {
        await statement.executeAsync({
          $id: r.id ?? null,
          $plantId: r.plantId ?? null,
          $soilMoisture: r.soilMoisture ?? null,
          $temperature: r.temperature ?? null,
          $airHumidity: r.airHumidity ?? null,
          $nitrogen: r.nitrogen ?? null,
          $phosphorus: r.phosphorus ?? null,
          $potassium: r.potassium ?? null,
          $aiDiagnosis: r.aiDiagnosis ?? null,
          $actionRecommended: r.actionRecommended ?? null,
          $isUrgent: r.isUrgent ? 1 : 0,
          $levelUrgent: r.levelUrgent ?? null,
          $isRead: r.isRead ? 1 : 0,
          $parametersIdeas: r.parametersIdeas ?? null,
          $created_at: r.created_at ?? null,
          $updated_at: r.updated_at ?? r.created_at ?? new Date().toISOString(),
        });
      }
    } finally {
      await statement.finalizeAsync();
    }
  },

  async deleteMany(ids: string[]) {
    if (ids.length === 0) return;
    const db = await getDBConnection();
    if (!db) return [];
    const placeholders = ids.map(() => "?").join(",");
    await db.runAsync(
      `DELETE FROM sensor_readings WHERE id IN (${placeholders})`,
      ids,
    );
  },

  async getUrgentAlerts(): Promise<any[]> {
    const db = await getDBConnection();
    if (!db) return [];
    const rows = await db.getAllAsync<any>(`
      SELECT r.*, p.name as plantName, p.especie as plantEspecie 
      FROM sensor_readings r 
      LEFT JOIN plants p ON r.plantId = p.id 
      WHERE r.isUrgent = 1 AND r.isRead = 0 
      ORDER BY r.created_at DESC
    `);

    return rows.map((r) => ({
      ...r,
      isUrgent: Boolean(r.isUrgent),
      isRead: Boolean(r.isRead),
      plant: { id: r.plantId, name: r.plantName, especie: r.plantEspecie },
    }));
  },

  async getReadingsByPlantId(plantId: string): Promise<SensorReading[]> {
    const db = await getDBConnection();
    if (!db) return [];
    const rows = await db.getAllAsync<any>(
      "SELECT * FROM sensor_readings WHERE plantId = ? ORDER BY created_at DESC",
      [plantId],
    );
    return rows.map((r) => ({
      ...r,
      isUrgent: Boolean(r.isUrgent),
      isRead: Boolean(r.isRead),
    }));
  },

  async getAverageMetrics(): Promise<{ avgMoisture: number; avgTemp: number }> {
    const db = await getDBConnection();
    if (!db) return { avgMoisture: 0, avgTemp: 0 };

    const result = await db.getFirstAsync<any>(`
      SELECT 
        AVG(soilMoisture) as avgMoisture, 
        AVG(temperature) as avgTemp 
      FROM sensor_readings
    `);

    return {
      avgMoisture: result?.avgMoisture
        ? Number(result.avgMoisture.toFixed(1))
        : 0,
      avgTemp: result?.avgTemp ? Number(result.avgTemp.toFixed(1)) : 0,
    };
  },

  async clear() {
    const db = await getDBConnection();
    if (!db) return [];
    await db.execAsync("DELETE FROM sensor_readings");
  },
};
