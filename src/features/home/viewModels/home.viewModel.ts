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

      setAlerts((prev) => [alertData, ...prev]);
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
        const [indicators, urgentData] = await Promise.all([
          dashboardService.getIndicators(),
          dashboardService.getUrgentAlerts(1, 1),
        ]);
        setSummary(indicators);
        setAlerts(urgentData.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Erro de conexão com o servidor.",
        );
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
    try {
      const res = await dashboardService.getUrgentAlerts(1, 5);
      setModalAlerts(res.data);
      setHasMoreModal(res.page < res.totalPages);
    } catch (err) {
      console.error("Erro ao carregar modal:", err);
    } finally {
      setLoadingModal(false);
    }
  };

  const loadMoreAlerts = async (): Promise<void> => {
    if (!hasMoreModal || loadingModal) return;
    setLoadingModal(true);
    try {
      const nextPage = modalPage + 1;
      const res = await dashboardService.getUrgentAlerts(nextPage, 5);
      setModalAlerts((prev) => [...prev, ...res.data]);
      setModalPage(nextPage);
      setHasMoreModal(res.page < res.totalPages);
    } catch (err) {
      console.error("Erro ao paginar alertas:", err);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleMarkAsRead = async (readingId: string): Promise<boolean> => {
    try {
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
      setError("Falha ao marcar alerta como lido.");
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
    clearError: () => setError(""),
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
