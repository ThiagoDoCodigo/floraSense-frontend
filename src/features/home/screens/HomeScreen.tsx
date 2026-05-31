import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Leaf,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sprout,
  X,
} from "lucide-react-native";

import { Typography, colors, AlertMessage } from "react-native-th-components";
import { useDashboardViewModel } from "../viewModels/home.viewModel";
import type { DashboardAlert } from "../models/home.model";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { MetricCard } from "../../../components/MetricCard";
import { AlertCard } from "../../../components/AlertCard";
import { ErrorIndicator } from "../../../components/ErrorIndicator";
import { EmptyState } from "../../../components/EmptyState";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const {
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
    onRefresh,
    clearError,
    openAllAlerts,
    loadMoreAlerts,
    handleMarkAsRead,
    loadDashboardData,
  } = useDashboardViewModel();

  if ((loading || refreshing) && !summary) {
    return (
      <LoadingIndicator
        message="Preparando seu painel..."
        subMessage="Buscando dados recentes da IA"
        fullScreen={true}
      />
    );
  }

  if (error && !summary) {
    return (
      <ErrorIndicator
        title="Oops! Servidor Indisponível"
        message={error}
        onRetry={() => loadDashboardData()}
        fullScreen={true}
      />
    );
  }

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "BOM DIA";
    if (hour >= 12 && hour < 18) return "BOA TARDE";
    return "BOA NOITE";
  };

  const firstName = user?.name
    ? user.name.split(" ")[0].toUpperCase()
    : "USUÁRIO";

  const onAlertPress = async (alert: DashboardAlert): Promise<void> => {
    const success = await handleMarkAsRead(alert.id);
    if (success) {
      if (isModalVisible) setIsModalVisible(false);
      navigation.navigate("PlantDetail", { plantId: alert.plantId });
    }
  };

  return (
    <View style={styles.container}>
      {error && summary ? (
        <AlertMessage
          title="Erro"
          message={error}
          type="error"
          onClose={clearError}
        />
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
          />
        }
      >
        <View style={styles.welcomeSection}>
          <View>
            <Typography
              variant="caption"
              weight="bold"
              color={colors.primary.main}
              style={{ letterSpacing: 1 }}
            >
              {getGreeting()}, {firstName}
            </Typography>
            <Typography
              variant="h1"
              color={colors.text.primary}
              style={{ marginTop: 4 }}
            >
              Visão Geral
            </Typography>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Sprout size={24} color={colors.primary.main} />
          </View>
        </View>

        {summary && (
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <MetricCard
                title="Total de Plantas"
                value={summary.totalPlants}
                icon={Leaf}
                color={colors.success.main}
                bgColor={colors.success.light}
              />
              <MetricCard
                title="Atenção Necessária"
                value={summary.plantsInAttention}
                icon={AlertTriangle}
                color={colors.danger.main}
                bgColor={colors.danger.faded}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                title="Umidade Média do Solo"
                value={`${summary.averageSoilMoisture}%`}
                icon={Droplets}
                color={colors.info.main}
                bgColor={colors.info.light}
              />
              <MetricCard
                title="Temp. Ambiente"
                value={`${summary.averageTemperature}°C`}
                icon={Thermometer}
                color={colors.warning.main}
                bgColor={colors.warning.faded}
              />
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Typography variant="title" color={colors.text.primary}>
            Alertas da IA
          </Typography>
          {alerts.length > 0 && (
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={openAllAlerts}
            >
              <Typography
                variant="caption"
                weight="bold"
                color={colors.primary.main}
              >
                Ver todos
              </Typography>
              <ChevronRight size={14} color={colors.primary.main} />
            </TouchableOpacity>
          )}
        </View>

        {alerts.length > 0 ? (
          <View style={styles.alertsContainer}>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onPress={onAlertPress} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyAlerts}>
            <CheckCircle2
              size={40}
              color={colors.success.main}
              style={{ marginBottom: 12 }}
            />
            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              align="center"
            >
              Tudo perfeito!
            </Typography>
            <Typography
              variant="caption"
              color={colors.text.secondary}
              align="center"
              style={{ marginTop: 4 }}
            >
              Suas plantas estão saudáveis e sem alertas urgentes.
            </Typography>
          </View>
        )}

        <View style={{ marginTop: 16 }}>
          <Typography
            variant="title"
            color={colors.text.primary}
            style={{ marginBottom: 16 }}
          >
            Acesso Rápido
          </Typography>

          <TouchableOpacity
            style={styles.quickActionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("PlantsTab")}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: colors.primary.faded },
              ]}
            >
              <Leaf size={24} color={colors.primary.main} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                variant="body"
                weight="bold"
                color={colors.text.primary}
              >
                Acessar Meu Cultivo
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Ver todas as plantas cadastradas
              </Typography>
            </View>
            <ChevronRight size={20} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("AddPlant")}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: colors.success.light },
              ]}
            >
              <Sprout size={24} color={colors.success.main} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                variant="body"
                weight="bold"
                color={colors.text.primary}
              >
                Nova Planta
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Sincronizar novo sensor ESP32
              </Typography>
            </View>
            <ChevronRight size={20} color={colors.text.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Typography variant="title">Todos os Alertas</Typography>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeModalBtn}
            >
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={modalAlerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AlertCard alert={item} onPress={onAlertPress} />
            )}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            onEndReached={loadMoreAlerts}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={
              !loading ? (
                <EmptyState
                  title="Nenhum alerta"
                  message="Nenhum alerta encontrado"
                />
              ) : null
            }
            ListFooterComponent={
              loadingModal ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary.main}
                  style={{ margin: 16 }}
                />
              ) : null
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  metricsGrid: { gap: 12, marginBottom: 32 },
  metricsRow: { flexDirection: "row", gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllButton: { flexDirection: "row", alignItems: "center" },
  alertsContainer: { gap: 12, marginBottom: 16 },
  emptyAlerts: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: 14,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  closeModalBtn: { padding: 4 },
});
