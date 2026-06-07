import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDBConnection = async () => {
  if (Platform.OS === "web") {
    return null;
  }

  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("florasense.db");

    await dbInstance.execAsync("PRAGMA journal_mode = WAL;");
    await dbInstance.execAsync("PRAGMA foreign_keys = ON;");
  }

  return dbInstance;
};
