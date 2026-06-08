import { getDBConnection } from "./connection";

const MIGRATIONS = [
  {
    id: 1,
    name: "create_plants_table",
    query: `
      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        especie TEXT NOT NULL,
        phaseOfLife TEXT,
        environmentType TEXT,
        sunlightExposure TEXT,
        substrateType TEXT,
        plantingDate TEXT,
        imageUrl TEXT,
        isConnected INTEGER,
        macAddress TEXT,
        firmwareVersion TEXT,
        lastConnectionDate TEXT,
        delayReading INTEGER,
        created_at TEXT,
        updated_at TEXT
      );
    `,
  },
  {
    id: 2,
    name: "create_readings_table",
    query: `
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id TEXT PRIMARY KEY,
        plantId TEXT NOT NULL,
        soilMoisture REAL,
        temperature REAL,
        airHumidity REAL,
        nitrogen REAL,
        phosphorus REAL,
        potassium REAL,
        aiDiagnosis TEXT,
        actionRecommended TEXT,
        isUrgent INTEGER,
        levelUrgent TEXT,
        isRead INTEGER,
        parametersIdeas TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (plantId) REFERENCES plants (id) ON DELETE CASCADE
      );
    `,
  },
];

export const runMigrations = async () => {
  try {
    const db = await getDBConnection();

    if (!db) return;

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        executed_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const executedMigrations = await db.getAllAsync<{ id: number }>(
      "SELECT id FROM migrations",
    );
    const executedIds = executedMigrations.map((m) => m.id);

    for (const migration of MIGRATIONS) {
      if (!executedIds.includes(migration.id)) {
        console.log(`[DB] Executando migration: ${migration.name}`);
        await db.execAsync(migration.query);
        await db.runAsync("INSERT INTO migrations (id, name) VALUES (?, ?)", [
          migration.id,
          migration.name,
        ]);
      }
    }
  } catch (error) {
    console.error("[DB] Erro nas migrations:", error);
  }
};
