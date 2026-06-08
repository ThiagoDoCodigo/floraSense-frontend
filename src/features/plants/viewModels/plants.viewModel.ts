import { useState, useCallback, useEffect, useRef } from "react";
import { Platform, Linking } from "react-native";
import plantService from "../services/plant.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import NetInfo from "@react-native-community/netinfo";
import socketService from "../../../services/socket.service";
import { BleManager, Device } from "react-native-ble-plx";
import base64 from "react-native-base64";
import { PermissionsAndroid } from "react-native";
import { PlantRepository } from "../../../database/repositories/plant.repository";
import { ReadingRepository } from "../../../database/repositories/reading.repository";
import {
  Plant,
  SensorReading,
  PlantFormErrors,
  PlantPhaseEnum,
  EnvironmentTypeEnum,
  SunlightExposureEnum,
  SubstrateTypeEnum,
  FilterOptions,
} from "../models/plant.model";

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
  const [filters, setFilters] = useState<FilterOptions>({
    name: "",
    especie: "",
    phaseOfLife: "",
  });

  const fetchPlants = useCallback(
    async (
      pageNumber: number,
      isRefresh = false,
      activeFilters?: FilterOptions,
    ) => {
      if (isRefresh) setLoading(true);
      else setLoadingMore(true);
      setError("");

      const currentFilters =
        activeFilters !== undefined ? activeFilters : filters;

      try {
        const LIMIT = 10;

        const paginatedLocal = await PlantRepository.getFiltered(
          pageNumber,
          LIMIT,
          currentFilters,
        );

        setPlants((prev) => {
          if (isRefresh) return paginatedLocal;
          const existingIds = new Set(prev.map((p) => p.id));
          const unique = paginatedLocal.filter((p) => !existingIds.has(p.id));
          return [...prev, ...unique];
        });

        setHasMore(paginatedLocal.length === LIMIT);
        setPage(pageNumber);

        const netInfo = await NetInfo.fetch();

        if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
          const response = await plantService.getPlants({
            page: pageNumber,
            limit: LIMIT,
            ...currentFilters,
          });

          const newData = response?.data ?? [];

          if (newData.length > 0) {
            try {
              await PlantRepository.upsert(newData);
            } catch (dbErr) {
              console.error("[CACHE ERROR] Falha ao salvar lista:", dbErr);
            }
          }

          setPlants((prev) => {
            if (isRefresh) return newData;
            const existingIds = new Set(prev.map((p) => p.id));
            const unique = newData.filter((p) => !existingIds.has(p.id));
            return [...prev, ...unique];
          });

          setHasMore(pageNumber < (response?.totalPages ?? 1));
        }
      } catch (err: any) {
        if (err.message === "OFFLINE_MODE" || err.code === "ERR_NETWORK") {
          console.log("[DEBUG] Interceptado modo offline na listagem.");
        } else {
          setError(
            err?.response?.data?.message ??
              "Falha silenciosa ao sincronizar sua lista com a nuvem.",
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters],
  );

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    fetchPlants(1, true, newFilters);
  };

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
    filters,
    applyFilters,
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
        const LIMIT = 10;

        const localPlants = await PlantRepository.getAll();
        const localPlant = localPlants.find((p) => p.id === plantId);
        if (localPlant) setPlant(localPlant);

        const paginatedLocal = await ReadingRepository.getPaginatedByPlantId(
          plantId,
          pageNum,
          LIMIT,
        );

        setReadings((prev) => {
          if (isRefresh) return paginatedLocal;
          const existingIds = new Set(prev.map((r) => r.id));
          const unique = paginatedLocal.filter((r) => !existingIds.has(r.id));
          return [...prev, ...unique];
        });

        setHasMore(paginatedLocal.length === LIMIT);
        setPage(pageNum);

        const netInfo = await NetInfo.fetch();

        if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
          let latestPlant: Plant | null = null;

          if (isRefresh) {
            latestPlant = await plantService.getPlantById(plantId);
            setPlant(latestPlant ?? null);
          }

          const readingsResponse = await plantService.getPlantReadings(
            plantId,
            pageNum,
            LIMIT,
          );
          const newData = readingsResponse?.data ?? [];

          if (newData.length > 0) {
            try {
              const plantToSave = latestPlant || localPlant;
              if (plantToSave) {
                await PlantRepository.upsert([plantToSave]);
              }
              await ReadingRepository.upsert(newData);
            } catch (dbErr) {
              console.error("[CACHE ERROR] Integridade FK falhou:", dbErr);
            }
          }

          setReadings((prev) => {
            if (isRefresh) return newData;
            const existingIds = new Set(prev.map((r) => r.id));
            const uniqueNewData = newData.filter((r) => !existingIds.has(r.id));
            return [...prev, ...uniqueNewData];
          });

          setHasMore(pageNum < (readingsResponse?.totalPages ?? 1));
        }
      } catch (err: any) {
        if (err.message === "OFFLINE_MODE" || err.code === "ERR_NETWORK") {
          console.log("[DEBUG] Interceptado modo offline no Dashboard.");
        } else {
          setError(
            err?.response?.data?.message ??
              "Não foi possível sincronizar os dados do sensor.",
          );
        }
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

  useEffect(() => {
    if (!plantId || !socketService.socket) return;

    socketService.joinPlant(plantId);

    const handleNewReading = (newReading: SensorReading) => {
      setReadings((prev) => [newReading, ...prev]);
    };

    socketService.socket.on("new_sensor_reading", handleNewReading);

    return () => {
      socketService.socket?.off("new_sensor_reading", handleNewReading);
      socketService.leavePlant(plantId);
    };
  }, [plantId]);

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
  const [localImageUri, setLocalImageUri] = useState("");
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

  const [imageRationaleVisible, setImageRationaleVisible] = useState(false);
  const [imageBlockedVisible, setImageBlockedVisible] = useState(false);
  const permissionResolver = useRef<((value: boolean) => void) | null>(null);

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const checkImagePermissions = async (): Promise<boolean> => {
    if (Platform.OS === "web") return true;

    const { status, canAskAgain } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status === "granted") return true;

    if (!canAskAgain) {
      setImageBlockedVisible(true);
      return false;
    }

    return new Promise((resolve) => {
      permissionResolver.current = resolve;
      setImageRationaleVisible(true);
    });
  };

  const handleRationaleConfirm = async () => {
    setImageRationaleVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      permissionResolver.current?.(true);
    } else {
      permissionResolver.current?.(false);
      setImageBlockedVisible(true);
    }
  };

  const handleImagePick = async () => {
    const hasPermission = await checkImagePermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setLocalImageUri(result.assets[0].uri);
    }
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
      throw new Error("Validation Failed");
    }

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    setSaving(true);
    try {
      await plantService.addPlant(
        {
          name: name.trim(),
          especie: especie.trim(),
          phaseOfLife,
          environmentType,
          sunlightExposure,
          substrateType,
        },
        localImageUri || undefined,
      );
      setSuccess("Planta cadastrada com sucesso!");
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Falha ao salvar planta no servidor.",
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
    localImageUri,
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
    handleImagePick,
    imageRationaleVisible,
    imageBlockedVisible,
    handleRationaleConfirm,
    handleRationaleCancel: () => setImageRationaleVisible(false),
    handleBlockedConfirm: () => {
      setImageBlockedVisible(false);
      Linking.openSettings();
    },
    handleBlockedCancel: () => setImageBlockedVisible(false),
  };
};

export const useEditPlantViewModel = (initialPlant: Plant | null) => {
  const [name, setName] = useState(initialPlant?.name ?? "");
  const [especie, setEspecie] = useState(initialPlant?.especie ?? "");

  const [imageUrl, setImageUrl] = useState(initialPlant?.imageUrl ?? "");
  const [localImageUri, setLocalImageUri] = useState("");

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

  const [imageRationaleVisible, setImageRationaleVisible] = useState(false);
  const [imageBlockedVisible, setImageBlockedVisible] = useState(false);
  const permissionResolver = useRef<((value: boolean) => void) | null>(null);

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const checkImagePermissions = async (): Promise<boolean> => {
    if (Platform.OS === "web") return true;
    const { status, canAskAgain } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status === "granted") return true;

    if (!canAskAgain) {
      setImageBlockedVisible(true);
      return false;
    }

    return new Promise((resolve) => {
      permissionResolver.current = resolve;
      setImageRationaleVisible(true);
    });
  };

  const handleRationaleConfirm = async () => {
    setImageRationaleVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      permissionResolver.current?.(true);
    } else {
      permissionResolver.current?.(false);
      setImageBlockedVisible(true);
    }
  };

  const handleImagePick = async () => {
    const hasPermission = await checkImagePermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setLocalImageUri(result.assets[0].uri);
    }
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
      throw new Error("Missing ID");
    }

    clearMessages();
    if (!validateFields()) {
      setError("Verifique os campos destacados.");
      throw new Error("Validation Failed");
    }

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    setSaving(true);
    try {
      await plantService.updatePlant(
        initialPlant.id,
        {
          name: name.trim(),
          especie: especie.trim(),
          phaseOfLife,
          environmentType,
          sunlightExposure,
          substrateType,
        },
        localImageUri || undefined,
      );
      setSuccess("Informações atualizadas com sucesso!");
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Falha ao atualizar a planta.");
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
    localImageUri,
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
    handleImagePick,
    imageRationaleVisible,
    imageBlockedVisible,
    handleRationaleConfirm,
    handleRationaleCancel: () => setImageRationaleVisible(false),
    handleBlockedConfirm: () => {
      setImageBlockedVisible(false);
      Linking.openSettings();
    },
    handleBlockedCancel: () => setImageBlockedVisible(false),
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

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

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

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

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
    "loading" | "scan" | "wifi" | "connected" | "error" | "permission_blocked"
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

  const [rationaleModalVisible, setRationaleModalVisible] = useState(false);
  const [blockedModalVisible, setBlockedModalVisible] = useState(false);
  const [rationaleMessage, setRationaleMessage] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

  const permissionResolver = useRef<((value: boolean) => void) | null>(null);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      const apiLevel = Platform.Version as number;

      if (apiLevel >= 31) {
        const scanCheck = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        const connectCheck = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        if (scanCheck && connectCheck) return true;

        setRationaleMessage(
          "Para encontrar e parear o módulo FloraSense, precisamos de acesso ao Bluetooth (Dispositivos Próximos). Você autoriza?",
        );
        setBlockedMessage(
          "O sistema bloqueou a solicitação de Bluetooth. Deseja abrir as configurações do aparelho para liberar o acesso a 'Dispositivos Próximos' manualmente?",
        );
      } else {
        const locCheck = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (locCheck) return true;

        setRationaleMessage(
          "O Android exige acesso à Localização para conseguir escanear dispositivos Bluetooth próximos. O FloraSense precisa dessa permissão para parear sua planta. Você autoriza?",
        );
        setBlockedMessage(
          "O sistema bloqueou a solicitação de Localização. Deseja abrir as configurações do aparelho para liberar o acesso manualmente e permitir o pareamento Bluetooth?",
        );
      }

      return new Promise((resolve) => {
        permissionResolver.current = resolve;
        setRationaleModalVisible(true);
      });
    }
    return true;
  };

  const handleRationaleConfirm = async () => {
    setRationaleModalVisible(false);
    const apiLevel = Platform.Version as number;
    let granted = false;
    let blocked = false;

    if (apiLevel >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      if (
        result["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        granted = true;
      } else if (
        result["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        result["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        blocked = true;
      }
    } else {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        granted = true;
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        blocked = true;
      }
    }

    if (granted) {
      permissionResolver.current?.(true);
    } else if (blocked) {
      setStep("permission_blocked");
      setBlockedModalVisible(true);
    } else {
      permissionResolver.current?.(false);
      setError("A permissão foi negada. O escaneamento foi cancelado.");
    }
  };

  const handleRationaleCancel = () => {
    setRationaleModalVisible(false);
    permissionResolver.current?.(false);
    setError("Precisamos da permissão para encontrar seu módulo.");
  };

  const handleBlockedConfirm = () => {
    setBlockedModalVisible(false);
    permissionResolver.current?.(false);
    Linking.openSettings();
  };

  const handleBlockedCancel = () => {
    setBlockedModalVisible(false);
    permissionResolver.current?.(false);
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
      if (typeof bleManager !== "undefined" && bleManager) {
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
      bleManager!.stopDeviceScan();
      setIsScanning(false);
    }, 8000);
  };

  const connectToDevice = async (deviceWrap: any) => {
    setIsConnecting(deviceWrap.id);
    clearMessages();
    if (bleManager) bleManager.stopDeviceScan();
    setIsScanning(false);

    try {
      const device = await deviceWrap.rawDevice.connect({ autoConnect: false });
      await device.discoverAllServicesAndCharacteristics();

      if (Platform.OS === "android") {
        await device.requestMTU(512);
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

      await targetDevice.writeCharacteristicWithoutResponseForService(
        "4fa2c001-1234-4b2a-bf36-542194689400",
        "4fa2c002-1234-4b2a-bf36-542194689400",
        encodedPayload,
      );

      let isWifiConnected = false;
      let attempts = 0;

      while (attempts < 15) {
        await new Promise((res) => setTimeout(res, 1500));

        const char = await targetDevice.readCharacteristicForService(
          "4fa2c001-1234-4b2a-bf36-542194689400",
          "4fa2c003-1234-4b2a-bf36-542194689400",
        );

        const status = base64.decode(char.value);

        if (status === "WIFI_OK") {
          isWifiConnected = true;
          break;
        } else if (status === "WIFI_FAIL") {
          throw new Error(
            "O hardware não conseguiu conectar ao Wi-Fi. Verifique a senha e o sinal (Apenas redes 2.4GHz são suportadas).",
          );
        }

        attempts++;
      }

      if (!isWifiConnected) {
        throw new Error(
          "Tempo limite excedido. O hardware demorou demais para responder ao teste de Wi-Fi.",
        );
      }

      await plantService.connectESP32(plantId, {
        macAddress: targetDevice.id,
        firmwareVersion: "v1.0.0",
      });

      setSuccess("Hardware provisionado com sucesso! O módulo já está online.");
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
    setStep,
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
    rationaleModalVisible,
    blockedModalVisible,
    rationaleMessage,
    blockedMessage,
    handleRationaleConfirm,
    handleRationaleCancel,
    handleBlockedConfirm,
    handleBlockedCancel,
  };
};
