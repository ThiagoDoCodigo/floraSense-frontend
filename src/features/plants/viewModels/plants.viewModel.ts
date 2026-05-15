import { useState, useEffect, useCallback } from "react";
import plantService from "../services/plant.service";
import type {
  Plant,
  SensorReading,
  PlantFormErrors,
} from "../models/plant.model";

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
          err?.message ?? "Falha silenciosa ao buscar sua lista de plantas.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPlants(1, true);
  }, [fetchPlants]);

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!plantId) return setError("Referência da planta inválida.");
    setLoading(true);
    setError("");

    try {
      const [plantData, readingsData] = await Promise.all([
        plantService.getPlantById(plantId),
        plantService.getPlantReadings(plantId),
      ]);
      setPlant(plantData ?? null);
      setReadings(readingsData ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Não foi possível carregar os dados do sensor.");
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    plant,
    readings,
    loading,
    error,
    refresh: loadData,
    clearError: () => setError(""),
  };
};

export const useAddPlantViewModel = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
    if (!species.trim())
      errors.species = "Informe a espécie ou família da planta.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const savePlant = async (): Promise<boolean> => {
    clearMessages();
    if (!validateFields()) {
      setError("Verifique os campos destacados.");
      return false;
    }

    setSaving(true);
    try {
      await plantService.addPlant({
        name: name.trim(),
        species: species.trim(),
        imageUrl,
      });
      setSuccess("Planta cadastrada com sucesso!");
      return true;
    } catch (err: any) {
      setError(err?.message ?? "Ocorreu um erro ao comunicar com a Nuvem.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    species,
    setSpecies,
    imageUrl,
    setImageUrl,
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
  const [species, setSpecies] = useState(initialPlant?.species ?? "");
  const [imageUrl, setImageUrl] = useState(initialPlant?.imageUrl ?? "");

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
    if (!species.trim()) errors.species = "A espécie é essencial para a IA.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveChanges = async (): Promise<boolean> => {
    if (!initialPlant?.id) {
      setError("Referência de planta perdida. Volte e tente novamente.");
      return false;
    }

    clearMessages();
    if (!validateFields()) return false;

    setSaving(true);
    try {
      await plantService.updatePlant(initialPlant.id, {
        name: name.trim(),
        species: species.trim(),
        imageUrl,
      });
      setSuccess("Informações atualizadas com sucesso!");
      return true;
    } catch (err: any) {
      setError(err?.message ?? "Falha ao salvar as edições.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    species,
    setSpecies,
    imageUrl,
    setImageUrl,
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
  const [step, setStep] = useState<"scan" | "wifi">("scan");

  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<
    { id: string; name: string; signal: number }[]
  >([]);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [pairing, setPairing] = useState(false);

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
      return false;
    }

    setPairing(true);
    try {
      await plantService.pairESP32(plantId, ssid.trim(), password);
      setSuccess("Hardware provisionado com sucesso na rede Wi-Fi!");
      return true;
    } catch (err: any) {
      setError(
        err?.message ??
          "A comunicação BLE falhou durante o envio das credenciais.",
      );
      return false;
    } finally {
      setPairing(false);
    }
  };

  useEffect(() => {
    scanDevices();
  }, [scanDevices]);

  return {
    step,
    isScanning,
    devices,
    connectedDevice,
    isConnecting,
    ssid,
    setSsid,
    password,
    setPassword,
    pairing,
    error,
    success,
    scanDevices,
    connectToDevice,
    pairDevice,
    clearMessages,
  };
};
