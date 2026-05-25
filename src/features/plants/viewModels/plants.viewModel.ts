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

export const useManualControlViewModel = (plantId: string) => {
  const [volume, setVolume] = useState("100");
  const [interval, setInterval] = useState("60");
  const [loadingAction, setLoadingAction] = useState<
    "water" | "interval" | null
  >(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const waterPlant = async () => {
    if (!plantId) return setError("Planta não identificada.");
    clearMessages();
    setLoadingAction("water");

    try {
      await plantService.triggerManualWatering(plantId, Number(volume));
      setSuccess(`Comando MQTT enviado! Irrigando ${volume}ml.`);
    } catch (err: any) {
      setError(err?.message ?? "O hardware não respondeu ao comando de rega.");
    } finally {
      setLoadingAction(null);
    }
  };

  const updateInterval = async () => {
    if (!plantId) return setError("Planta não identificada.");
    clearMessages();
    setLoadingAction("interval");

    try {
      await plantService.updateESPConfig(plantId, Number(interval));
      setSuccess(`O ESP32 agora fará leituras a cada ${interval} min.`);
    } catch (err: any) {
      setError(
        err?.message ?? "Falha ao gravar o novo ciclo no microcontrolador.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    volume,
    setVolume,
    interval,
    setInterval,
    loadingAction,
    error,
    success,
    waterPlant,
    updateInterval,
    clearMessages,
  };
};

export const useBluetoothSetupViewModel = (plantId: string) => {
  const [step, setStep] = useState<
    "loading" | "scan" | "wifi" | "connected" | "error"
  >("loading");
  const [plant, setPlant] = useState<any | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<
    { id: string; name: string; signal: number }[]
  >([]);
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

  const scanDevices = useCallback(() => {
    setIsScanning(true);
    setDevices([]);
    clearMessages();

    setTimeout(() => {
      setDevices([
        { id: "mac_esp_1", name: "FloraSense-ESP-A2B4", signal: -45 },
        { id: "mac_tv_1", name: "Smart TV Sala", signal: -80 },
        { id: "mac_pc_2", name: "Desktop-Thiago", signal: -60 },
      ]);
      setIsScanning(false);
    }, 2000);
  }, []);

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
      setError("Não foi possível verificar o status do dispositivo.");
      setStep("error");
    }
  }, [plantId, scanDevices]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const connectToDevice = (device: { id: string; name: string }) => {
    setIsConnecting(device.id);
    clearMessages();

    setTimeout(() => {
      if (device.name.includes("FloraSense")) {
        setConnectedDevice(device.name);
        setStep("wifi");
      } else {
        setError("Este dispositivo não é um módulo FloraSense válido.");
      }
      setIsConnecting(null);
    }, 1500);
  };

  const pairDevice = async (): Promise<boolean> => {
    clearMessages();
    if (!ssid.trim() || !password) {
      setError("Preencha o nome da rede e a senha.");
      throw new Error("Missing credentials");
    }

    setPairing(true);
    try {
      await plantService.pairESP32(plantId, ssid.trim(), password);

      await plantService.connectESP32(plantId, {
        macAddress: "FC:F5:C4:0B:12:34",
        firmwareVersion: "v1.0.0",
      });

      setSuccess("Hardware provisionado com sucesso na rede Wi-Fi!");
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "A comunicação falhou durante o envio das credenciais.",
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await plantService.disconnectESP32(plantId);

      setSuccess("Dispositivo desvinculado com sucesso.");
      setPlant((prev: any) => (prev ? { ...prev, isConnected: false } : null));
      setStep("scan");
      scanDevices();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Falha ao tentar desvincular o dispositivo.",
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
