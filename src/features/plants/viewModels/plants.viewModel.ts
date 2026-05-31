import { useState, useEffect, useCallback } from "react";
import plantService from "../services/plant.service";
import {
  Plant,
  SensorReading,
  PlantFormErrors,
  PlantPhaseEnum,
  EnvironmentTypeEnum,
  SunlightExposureEnum,
  SubstrateTypeEnum,
} from "../models/plant.model";
import { useFocusEffect } from "@react-navigation/native";
import { BleManager, Device } from "react-native-ble-plx";
import base64 from "react-native-base64";
import * as Location from "expo-location";
import { useAuth } from "../../../contexts/AuthContext";
import { Platform } from "react-native";

let bleManager: BleManager | null = null;

if (Platform.OS !== "web") {
  bleManager = new BleManager();
}

export const usePlantListViewModel = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const fetchPlants = useCallback(
    async (pageNumber: number, isRefresh = false) => {
      if (isRefresh) setLoading(true);
      else setLoadingMore(true);
      setError("");

      try {
        const response = await plantService.getPlants(pageNumber);
        const newData = response?.data ?? [];

        setPlants((prev) => (isRefresh ? newData : [...prev, ...newData]));
        setHasMore(pageNumber < (response?.totalPages ?? 1));
        setPage(pageNumber);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            "Falha silenciosa ao buscar sua lista de plantas.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      fetchPlants(1, true);
    }, [fetchPlants]),
  );

  const loadMore = () => {
    if (!loadingMore && hasMore) fetchPlants(page + 1);
  };

  return {
    plants,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh: () => fetchPlants(1, true),
    clearError: () => setError(""),
  };
};

export const usePlantDashboardViewModel = (plantId: string) => {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const fetchReadings = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (!plantId) return;
      if (isRefresh) setLoading(true);
      else setLoadingMore(true);
      setError("");

      try {
        if (isRefresh) {
          const plantData = await plantService.getPlantById(plantId);
          setPlant(plantData ?? null);
        }
        const readingsResponse = await plantService.getPlantReadings(
          plantId,
          pageNum,
          10,
        );
        const newData = readingsResponse?.data ?? [];

        setReadings((prev) => (isRefresh ? newData : [...prev, ...newData]));
        setHasMore(pageNum < (readingsResponse?.totalPages ?? 1));
        setPage(pageNum);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            "Não foi possível carregar os dados do sensor.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [plantId],
  );

  useFocusEffect(
    useCallback(() => {
      fetchReadings(1, true);
    }, [fetchReadings]),
  );

  const loadMoreReadings = () => {
    if (!loadingMore && hasMore) fetchReadings(page + 1);
  };

  return {
    plant,
    readings,
    loading,
    loadingMore,
    error,
    refresh: () => fetchReadings(1, true),
    loadMoreReadings,
    clearError: () => setError(""),
  };
};

export const useAddPlantViewModel = () => {
  const [name, setName] = useState("");
  const [especie, setEspecie] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [phaseOfLife, setPhaseOfLife] = useState<PlantPhaseEnum>(
    PlantPhaseEnum.VEGETATIVE,
  );
  const [environmentType, setEnvironmentType] = useState<EnvironmentTypeEnum>(
    EnvironmentTypeEnum.INDOOR,
  );
  const [sunlightExposure, setSunlightExposure] =
    useState<SunlightExposureEnum>(SunlightExposureEnum.PARTIAL_SHADE);
  const [substrateType, setSubstrateType] = useState<SubstrateTypeEnum>(
    SubstrateTypeEnum.SOIL,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PlantFormErrors>({});

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const validateFields = (): boolean => {
    const errors: PlantFormErrors = {};
    if (!name.trim()) errors.name = "Defina um apelido para sua planta.";
    if (!especie.trim())
      errors.especie = "Informe a espécie para calibração da IA.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const savePlant = async (): Promise<boolean> => {
    clearMessages();
    if (!validateFields()) {
      setError("Verifique os campos destacados.");
      throw error;
    }

    setSaving(true);
    try {
      await plantService.addPlant({
        name: name.trim(),
        especie: especie.trim(),
        phaseOfLife,
        environmentType,
        sunlightExposure,
        substrateType,
      });
      setSuccess("Planta cadastrada com sucesso!");
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Falha de validação com o servidor.",
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    especie,
    setEspecie,
    imageUrl,
    setImageUrl,
    phaseOfLife,
    setPhaseOfLife,
    environmentType,
    setEnvironmentType,
    sunlightExposure,
    setSunlightExposure,
    substrateType,
    setSubstrateType,
    saving,
    error,
    success,
    fieldErrors,
    savePlant,
    clearMessages,
  };
};

export const useEditPlantViewModel = (initialPlant: Plant | null) => {
  const [name, setName] = useState(initialPlant?.name ?? "");
  const [especie, setEspecie] = useState(initialPlant?.especie ?? "");
  const [imageUrl, setImageUrl] = useState(initialPlant?.imageUrl ?? "");
  const [phaseOfLife, setPhaseOfLife] = useState<PlantPhaseEnum>(
    initialPlant?.phaseOfLife ?? PlantPhaseEnum.VEGETATIVE,
  );
  const [environmentType, setEnvironmentType] = useState<EnvironmentTypeEnum>(
    initialPlant?.environmentType ?? EnvironmentTypeEnum.INDOOR,
  );
  const [sunlightExposure, setSunlightExposure] =
    useState<SunlightExposureEnum>(
      initialPlant?.sunlightExposure ?? SunlightExposureEnum.PARTIAL_SHADE,
    );
  const [substrateType, setSubstrateType] = useState<SubstrateTypeEnum>(
    initialPlant?.substrateType ?? SubstrateTypeEnum.SOIL,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PlantFormErrors>({});

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const validateFields = (): boolean => {
    const errors: PlantFormErrors = {};
    if (!name.trim()) errors.name = "O apelido não pode ficar vazio.";
    if (!especie.trim()) errors.especie = "A espécie é essencial para a IA.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveChanges = async (): Promise<boolean> => {
    if (!initialPlant?.id) {
      setError("Referência de planta perdida. Volte e tente novamente.");
      throw error;
    }

    clearMessages();
    if (!validateFields()) {
      setError("Verifique os campos destacados.");
      throw error;
    }

    setSaving(true);
    try {
      await plantService.updatePlant(initialPlant.id, {
        name: name.trim(),
        especie: especie.trim(),
        phaseOfLife,
        environmentType,
        sunlightExposure,
        substrateType,
      });
      setSuccess("Informações atualizadas com sucesso!");
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Falha ao salvar as edições.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    especie,
    setEspecie,
    imageUrl,
    setImageUrl,
    phaseOfLife,
    setPhaseOfLife,
    environmentType,
    setEnvironmentType,
    sunlightExposure,
    setSunlightExposure,
    substrateType,
    setSubstrateType,
    saving,
    error,
    success,
    fieldErrors,
    saveChanges,
    clearMessages,
  };
};

export const useManualControlViewModel = (
  plantId: string,
  initialDelay: number = 480,
) => {
  const [interval, setIntervalVal] = useState(String(initialDelay) || "480");
  const [loadingAction, setLoadingAction] = useState<
    "interval" | "force" | null
  >(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const updateInterval = async () => {
    if (!plantId) return;
    clearMessages();
    setLoadingAction("interval");

    const intervalNumber = Number(interval);
    if (isNaN(intervalNumber) || intervalNumber < 15) {
      setLoadingAction(null);
      setError(
        "O intervalo mínimo do hardware é de 15 minutos para evitar superaquecimento do sensor de solo.",
      );
      throw new Error("Invalid interval");
    }

    try {
      await plantService.updateReadingInterval(plantId, intervalNumber);
      setSuccess(`Enviado! O ESP32 acordará a cada ${interval} minutos.`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Falha ao enviar comando. O módulo pode estar offline.",
      );
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  const forceReading = async () => {
    if (!plantId) return;
    clearMessages();
    setLoadingAction("force");

    try {
      await plantService.forceReading(plantId);
      setSuccess("Comando emitido! O ESP32 enviará a telemetria em instantes.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Falha ao forçar leitura. Módulo offline.",
      );
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    interval,
    setInterval: setIntervalVal,
    loadingAction,
    error,
    success,
    updateInterval,
    forceReading,
    clearMessages,
  };
};

export const useBluetoothSetupViewModel = (plantId: string) => {
  const { user } = useAuth();
  const [step, setStep] = useState<
    "loading" | "scan" | "wifi" | "connected" | "error"
  >("loading");
  const [plant, setPlant] = useState<any>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<
    { id: string; name: string; signal: number; rawDevice: Device }[]
  >([]);
  const [targetDevice, setTargetDevice] = useState<Device | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [pairing, setPairing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError(
        "Permissão de localização negada. O Android exige isso para escanear Bluetooth.",
      );
      return false;
    }
    return true;
  };

  const loadData = useCallback(async () => {
    setStep("loading");
    clearMessages();
    try {
      const plantData = await plantService.getPlantById(plantId);
      setPlant(plantData);

      if (plantData.isConnected) {
        setStep("connected");
      } else {
        setStep("scan");
        scanDevices();
      }
    } catch (err: any) {
      setError("Não foi possível verificar o status do dispositivo na nuvem.");
      setStep("error");
    }
  }, [plantId]);

  useEffect(() => {
    loadData();
    return () => {
      if (bleManager) {
        bleManager.stopDeviceScan();
      }
    };
  }, [loadData]);

  const scanDevices = async () => {
    if (Platform.OS === "web" || !bleManager) {
      setError(
        "O Bluetooth não é suportado na versão Web. Teste pelo celular.",
      );
      setIsScanning(false);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsScanning(true);
    setDevices([]);
    clearMessages();

    bleManager.startDeviceScan(null, null, (err, scannedDevice) => {
      if (err) {
        setError("Ligue o Bluetooth do celular e tente novamente.");
        setIsScanning(false);
        return;
      }

      if (scannedDevice && scannedDevice.name?.includes("FloraSense")) {
        const validName = scannedDevice.name || "FloraSense";

        setDevices((prev) => {
          if (prev.some((d) => d.id === scannedDevice.id)) return prev;
          return [
            ...prev,
            {
              id: scannedDevice.id,
              name: validName,
              signal: scannedDevice.rssi || 0,
              rawDevice: scannedDevice,
            },
          ];
        });
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 8000);
  };

  const connectToDevice = async (deviceWrap: any) => {
    setIsConnecting(deviceWrap.id);
    clearMessages();
    if (bleManager) {
      bleManager.stopDeviceScan();
    }
    setIsScanning(false);

    try {
      const device = await deviceWrap.rawDevice.connect({ autoConnect: false });
      await device.discoverAllServicesAndCharacteristics();

      if (Platform.OS === "android") {
        await device.requestMTU(512);
        console.log("MTU expandido com sucesso para envio de JSON!");
      }

      setTargetDevice(device);
      setConnectedDevice(device.name);
      setStep("wifi");
    } catch (err) {
      setError("Falha ao comunicar com a placa. Aproxime o celular.");
    } finally {
      setIsConnecting(null);
    }
  };

  const pairDevice = async (): Promise<boolean> => {
    clearMessages();
    if (!ssid.trim() || !password) {
      setError("Preencha a rede Wi-Fi e a senha.");
      throw new Error("Missing credentials");
    }
    if (!targetDevice || !user?.id) {
      setError("Conexão Bluetooth perdida. Volte e pareie novamente.");
      throw new Error("Device lost");
    }

    setPairing(true);
    try {
      const payloadObj = {
        ssid: ssid.trim(),
        password: password,
        plantId: plantId,
        userId: user.id,
        macAddress: targetDevice.id,
      };
      const encodedPayload = base64.encode(JSON.stringify(payloadObj));

      await new Promise((resolve) => setTimeout(resolve, 500));

      await targetDevice.writeCharacteristicWithoutResponseForService(
        "4fa2c001-1234-4b2a-bf36-542194689400",
        "4fa2c002-1234-4b2a-bf36-542194689400",
        encodedPayload,
      );

      await plantService.connectESP32(plantId, {
        macAddress: targetDevice.id,
        firmwareVersion: "v1.0.0",
      });

      setSuccess(
        "Hardware provisionado! O ESP32 está reiniciando e se conectando ao Wi-Fi.",
      );
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Falha na transmissão BLE.",
      );
      throw err;
    } finally {
      setPairing(false);
    }
  };

  const unpairDevice = async (): Promise<boolean> => {
    clearMessages();
    setDisconnecting(true);
    try {
      await plantService.disconnectESP32(plantId);

      setSuccess("Dispositivo desvinculado com sucesso.");
      setPlant((prev: any) => (prev ? { ...prev, isConnected: false } : null));
      setStep("scan");
      scanDevices();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Falha ao desvincular no servidor.",
      );
      throw err;
    } finally {
      setDisconnecting(false);
    }
  };

  return {
    step,
    plant,
    loadData,
    isScanning,
    devices,
    connectedDevice,
    isConnecting,
    ssid,
    setSsid,
    password,
    setPassword,
    pairing,
    disconnecting,
    error,
    success,
    scanDevices,
    connectToDevice,
    pairDevice,
    unpairDevice,
    clearMessages,
  };
};
