import { useState, useCallback, useEffect, useRef } from "react";
import { Platform, Linking } from "react-native";
import dashboardService from "../services/home.service";
import { useAuth } from "../../../contexts/AuthContext";
import type { DashboardSummary, DashboardAlert } from "../models/home.model";
import { AuthUserResponseDTO } from "../../auth/models/auth.model";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketService from "../../../services/socket.service";
import NetInfo from "@react-native-community/netinfo";
import { ReadingRepository } from "../../../database/repositories/reading.repository";
import { PlantRepository } from "../../../database/repositories/plant.repository";

export interface DashboardViewModelReturn {
  user: AuthUserResponseDTO | null;
  summary: DashboardSummary | null;
  alerts: DashboardAlert[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  isModalVisible: boolean;
  modalAlerts: DashboardAlert[];
  loadingModal: boolean;
  setIsModalVisible: (visible: boolean) => void;
  onRefresh: () => Promise<void>;
  clearError: () => void;
  openAllAlerts: () => Promise<void>;
  loadMoreAlerts: () => Promise<void>;
  handleMarkAsRead: (readingId: string) => Promise<boolean>;
  loadDashboardData: (isRefresh?: boolean) => Promise<void>;
  rationaleModalVisible: boolean;
  blockedModalVisible: boolean;
  handleRationaleConfirm: () => Promise<void>;
  handleRationaleCancel: () => void;
  handleBlockedConfirm: () => void;
  handleBlockedCancel: () => void;
}

export const useDashboardViewModel = (): DashboardViewModelReturn => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalAlerts, setModalAlerts] = useState<DashboardAlert[]>([]);
  const [modalPage, setModalPage] = useState<number>(1);
  const [hasMoreModal, setHasMoreModal] = useState<boolean>(true);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const [rationaleModalVisible, setRationaleModalVisible] = useState(false);
  const [blockedModalVisible, setBlockedModalVisible] = useState(false);
  const permissionResolver = useRef<((value: boolean) => void) | null>(null);

  const checkAndRequestPushPermissions = useCallback(async () => {
    if (Platform.OS === "web") return true;

    const { status, canAskAgain } = await Notifications.getPermissionsAsync();

    if (status === "granted") return true;

    if (!canAskAgain) {
      setBlockedModalVisible(true);
      return false;
    }

    return new Promise<boolean>((resolve) => {
      permissionResolver.current = resolve;
      setRationaleModalVisible(true);
    });
  }, []);

  const handleRationaleConfirm = async () => {
    setRationaleModalVisible(false);
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "granted") {
      permissionResolver.current?.(true);
    } else {
      permissionResolver.current?.(false);
      setBlockedModalVisible(true);
    }
  };

  const handleRationaleCancel = () => {
    setRationaleModalVisible(false);
    permissionResolver.current?.(false);
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

  useEffect(() => {
    checkAndRequestPushPermissions();
  }, [checkAndRequestPushPermissions]);

  useEffect(() => {
    if (!socketService.socket) return;

    const handleUrgentAlert = async (alertData: any) => {
      const shouldNotify = await AsyncStorage.getItem("receiptNotifications");
      const isEnabled = shouldNotify !== "false";

      if (isEnabled && Platform.OS !== "web") {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: alertData.title || "⚠️ Atenção Necessária",
              body: alertData.message,
              data: { readingId: alertData.readingId },
              sound: true,
            },
            trigger: null,
          });
        } catch (pushErr) {
          console.log("[Push Error Ignored on Web]:", pushErr);
        }
      }

      setAlerts((prev) => {
        const exists = prev.some((a) => a.id === alertData.id);
        if (exists) return prev;
        return [alertData, ...prev];
      });

      setSummary((prev) =>
        prev
          ? { ...prev, plantsInAttention: prev.plantsInAttention + 1 }
          : prev,
      );
    };

    socketService.socket.on("urgent_alert", handleUrgentAlert);

    return () => {
      socketService.socket?.off("urgent_alert", handleUrgentAlert);
    };
  }, []);

  const loadDashboardData = useCallback(
    async (isRefresh: boolean = false): Promise<void> => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      try {
        const [localAlerts, localPlants, metrics] = await Promise.all([
          ReadingRepository.getUrgentAlerts(),
          PlantRepository.getAll(),
          ReadingRepository.getAverageMetrics(),
        ]);

        setAlerts(localAlerts.slice(0, 1));
        setSummary({
          totalPlants: localPlants.length,
          plantsInAttention: localAlerts.length,
          averageSoilMoisture: metrics.avgMoisture,
          averageTemperature: metrics.avgTemp,
        });

        const netInfo = await NetInfo.fetch();

        if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
          const [indicators, urgentData] = await Promise.all([
            dashboardService.getIndicators(),
            dashboardService.getUrgentAlerts(1, 1),
          ]);

          if (urgentData.data.length > 0) {
            try {
              await ReadingRepository.upsert(urgentData.data as any);
            } catch (dbErr) {
              console.log(
                "[CACHE INFO] Ignorando alerta local: planta ainda não sincronizada pelo serviço principal.",
              );
            }
          }

          setSummary(indicators);
          setAlerts(urgentData.data);
        }
      } catch (err: any) {
        if (err.message === "OFFLINE_MODE" || err.code === "ERR_NETWORK") {
          console.log("[DEBUG] Interceptado modo offline na Home.");
        } else {
          setError(
            err.response?.data?.message || "Erro de conexão com o servidor.",
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData]),
  );

  const openAllAlerts = async (): Promise<void> => {
    setIsModalVisible(true);
    setLoadingModal(true);
    setModalPage(1);
    const LIMIT = 5;

    try {
      const localAlerts = await ReadingRepository.getUrgentAlerts();
      setModalAlerts(localAlerts.slice(0, LIMIT));
      setHasMoreModal(localAlerts.length > LIMIT);

      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
        const res = await dashboardService.getUrgentAlerts(1, LIMIT);

        if (res.data.length > 0) {
          try {
            await ReadingRepository.upsert(res.data as any);
          } catch (e) {}
        }

        setModalAlerts(res.data);
        setHasMoreModal(res.page < res.totalPages);
      }
    } catch (err) {
      console.error("Erro ao carregar modal:", err);
    } finally {
      setLoadingModal(false);
    }
  };

  const loadMoreAlerts = async (): Promise<void> => {
    if (!hasMoreModal || loadingModal) return;
    setLoadingModal(true);
    const nextPage = modalPage + 1;
    const LIMIT = 5;

    try {
      const netInfo = await NetInfo.fetch();

      const localAlerts = await ReadingRepository.getUrgentAlerts();
      const startIndex = (nextPage - 1) * LIMIT;
      const endIndex = startIndex + LIMIT;
      const paginatedLocal = localAlerts.slice(startIndex, endIndex);

      setModalAlerts((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const uniques = paginatedLocal.filter((a) => !existingIds.has(a.id));
        return [...prev, ...uniques];
      });
      setModalPage(nextPage);
      setHasMoreModal(localAlerts.length > endIndex);

      if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
        const res = await dashboardService.getUrgentAlerts(nextPage, LIMIT);

        if (res.data.length > 0) {
          try {
            await ReadingRepository.upsert(res.data as any);
          } catch (e) {}
        }

        setModalAlerts((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const uniques = res.data.filter((a) => !existingIds.has(a.id));
          return [...prev, ...uniques];
        });
        setHasMoreModal(res.page < res.totalPages);
      }
    } catch (err) {
      console.error("Erro ao paginar alertas:", err);
    } finally {
      setLoadingModal(false);
    }
  };

  const clearError = useCallback(() => setError(""), []);

  const handleMarkAsRead = async (readingId: string): Promise<boolean> => {
    clearError();
    try {
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected || netInfo.isInternetReachable === false) {
        console.log(
          "[OFFLINE] Pulando marcação de lido na API, apenas permitindo navegação.",
        );
        return true;
      }

      await dashboardService.markAsRead(readingId);

      setAlerts((prev) => prev.filter((a) => a.id !== readingId));
      setModalAlerts((prev) => prev.filter((a) => a.id !== readingId));
      setSummary((prev) =>
        prev
          ? {
              ...prev,
              plantsInAttention: Math.max(0, prev.plantsInAttention - 1),
            }
          : prev,
      );

      return true;
    } catch (err) {
      setError("Falha ao marcar alerta como lido no servidor.");
      return false;
    }
  };

  return {
    user,
    summary,
    alerts,
    loading,
    refreshing,
    error,
    isModalVisible,
    modalAlerts,
    loadingModal,
    setIsModalVisible,
    onRefresh: () => loadDashboardData(true),
    clearError,
    openAllAlerts,
    loadMoreAlerts,
    handleMarkAsRead,
    loadDashboardData,
    rationaleModalVisible,
    blockedModalVisible,
    handleRationaleConfirm,
    handleRationaleCancel,
    handleBlockedConfirm,
    handleBlockedCancel,
  };
};
