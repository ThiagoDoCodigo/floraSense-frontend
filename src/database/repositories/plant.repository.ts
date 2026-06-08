import { getDBConnection } from "../connection";
import { Plant } from "../../features/plants/models/plant.model";
import { FilterOptions } from "../../features/plants/models/plant.model";

export const PlantRepository = {
  async upsert(plants: Plant[]) {
    if (plants.length === 0) return;
    const db = await getDBConnection();
    if (!db) return [];

    const statement = await db.prepareAsync(`
      INSERT INTO plants (id, userId, name, especie, phaseOfLife, environmentType, sunlightExposure, substrateType, plantingDate, imageUrl, isConnected, macAddress, firmwareVersion, lastConnectionDate, delayReading, created_at, updated_at)
      VALUES ($id, $userId, $name, $especie, $phaseOfLife, $environmentType, $sunlightExposure, $substrateType, $plantingDate, $imageUrl, $isConnected, $macAddress, $firmwareVersion, $lastConnectionDate, $delayReading, $created_at, $updated_at)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        especie = excluded.especie,
        phaseOfLife = excluded.phaseOfLife,
        environmentType = excluded.environmentType,
        sunlightExposure = excluded.sunlightExposure,
        substrateType = excluded.substrateType,
        plantingDate = excluded.plantingDate,
        imageUrl = excluded.imageUrl,
        isConnected = excluded.isConnected,
        macAddress = excluded.macAddress,
        firmwareVersion = excluded.firmwareVersion,
        lastConnectionDate = excluded.lastConnectionDate,
        delayReading = excluded.delayReading,
        updated_at = excluded.updated_at;
    `);

    try {
      for (const p of plants) {
        await statement.executeAsync({
          $id: p.id ?? null,
          $userId: p.userId ?? null,
          $name: p.name ?? null,
          $especie: p.especie ?? null,
          $phaseOfLife: p.phaseOfLife ?? null,
          $environmentType: p.environmentType ?? null,
          $sunlightExposure: p.sunlightExposure ?? null,
          $substrateType: p.substrateType ?? null,
          $plantingDate: p.plantingDate ?? null,
          $imageUrl: p.imageUrl ?? null,
          $isConnected: p.isConnected ? 1 : 0,
          $macAddress: p.macAddress ?? null,
          $firmwareVersion: p.firmwareVersion ?? null,
          $lastConnectionDate: p.lastConnectionDate ?? null,
          $delayReading: p.delayReading ?? 480,
          $created_at: p.created_at ?? null,
          $updated_at: p.updated_at ?? null,
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
    await db.runAsync(`DELETE FROM plants WHERE id IN (${placeholders})`, ids);
  },

  async getAll(): Promise<Plant[]> {
    const db = await getDBConnection();
    if (!db) return [];
    const rows = await db.getAllAsync<any>(
      "SELECT * FROM plants ORDER BY created_at DESC",
    );
    return rows.map((r) => ({ ...r, isConnected: Boolean(r.isConnected) }));
  },

  async getFiltered(
    page: number,
    limit: number,
    filters?: FilterOptions,
  ): Promise<Plant[]> {
    const db = await getDBConnection();
    if (!db) return [];

    let query = "SELECT * FROM plants";
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.name) {
      conditions.push("name LIKE ?");
      params.push(`%${filters.name}%`);
    }
    if (filters?.especie) {
      conditions.push("especie LIKE ?");
      params.push(`%${filters.especie}%`);
    }
    if (filters?.phaseOfLife) {
      conditions.push("phaseOfLife = ?");
      params.push(filters.phaseOfLife);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit);
    params.push((page - 1) * limit);

    const rows = await db.getAllAsync<any>(query, ...params);
    return rows.map((r) => ({ ...r, isConnected: Boolean(r.isConnected) }));
  },

  async countAll(): Promise<number> {
    const db = await getDBConnection();
    if (!db) return 0;

    const result = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) as total FROM plants",
    );
    return result?.total || 0;
  },

  async clear() {
    const db = await getDBConnection();
    if (!db) return [];
    await db.execAsync("DELETE FROM plants");
  },
};
