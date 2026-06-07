import AsyncStorage from "@react-native-async-storage/async-storage";
import { floraSenseApi } from "./floraSenseApi";
import { PlantRepository } from "../database/repositories/plant.repository";
import { ReadingRepository } from "../database/repositories/reading.repository";

const LAST_SYNC_KEY = "@FloraSense:lastSyncDate";

export const SyncService = {
  async performIncrementalSync() {
    try {
      const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
      const urlParams = lastSync
        ? `?lastSync=${encodeURIComponent(lastSync)}`
        : "";

      const { data } = await floraSenseApi.get(`/sync/delta${urlParams}`);

      if (data.plants) {
        if (data.plants.updated && data.plants.updated.length > 0) {
          await PlantRepository.upsert(data.plants.updated);
        }
        if (data.plants.deletedIds && data.plants.deletedIds.length > 0) {
          await PlantRepository.deleteMany(data.plants.deletedIds);
        }
      }

      if (data.readings) {
        if (data.readings.updated && data.readings.updated.length > 0) {
          await ReadingRepository.upsert(data.readings.updated);
        }
        if (data.readings.deletedIds && data.readings.deletedIds.length > 0) {
          await ReadingRepository.deleteMany(data.readings.deletedIds);
        }
      }

      if (data.nextSyncToken) {
        await AsyncStorage.setItem(LAST_SYNC_KEY, data.nextSyncToken);
      }
    } catch (error: any) {
      if (error.message !== "OFFLINE_MODE" && error.code !== "ERR_NETWORK") {
        console.error(error);
      }
    }
  },

  async wipeLocalData() {
    await PlantRepository.clear();
    await ReadingRepository.clear();
    await AsyncStorage.removeItem(LAST_SYNC_KEY);
  },
};
