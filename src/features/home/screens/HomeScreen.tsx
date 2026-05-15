import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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
  Activity,
  Sprout,
} from "lucide-react-native";

import { Typography, colors, AlertMessage } from "react-native-th-components";
import { useDashboardViewModel } from "../viewModels/home.viewModel";
import type { DashboardAlert } from "../models/home.model";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { summary, alerts, loading, refreshing, error, onRefresh, clearError } =
    useDashboardViewModel();

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: any,
    color: string,
    bgColor: string,
  ) => {
    const IconComponent = icon;
    return (
      <View style={styles.metricCard}>
        <View style={[styles.metricIconBox, { backgroundColor: bgColor }]}>
          <IconComponent size={20} color={color} />
        </View>
        <Typography variant="h2" style={styles.metricValue}>
          {value}
        </Typography>
        <Typography
          variant="caption"
          color={colors.text.secondary}
          style={styles.metricTitle}
        >
          {title}
        </Typography>
      </View>
    );
  };

  const renderAlertCard = (alert: DashboardAlert) => {
    const isCritical = alert.type === "critical";
    const accentColor = isCritical ? colors.danger.main : colors.warning.main;
    const bgColor = isCritical ? colors.danger.faded : colors.warning.faded;
    const Icon = isCritical ? AlertTriangle : Activity;

    return (
      <TouchableOpacity
        key={alert.id}
        activeOpacity={0.8}
        style={[styles.alertCard, { borderColor: accentColor }]}
        onPress={() =>
          navigation.navigate("PlantDetail", { plantId: alert.plantId })
        }
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertTitleRow}>
            <Icon size={16} color={accentColor} />
            <Typography
              variant="caption"
              weight="bold"
              color={accentColor}
              style={{ marginLeft: 6 }}
            >
              {alert.plantName}
            </Typography>
          </View>
          <Typography
            variant="caption"
            color={colors.text.muted}
            style={{ fontSize: 10 }}
          >
            {new Date(alert.timestamp).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </View>
        <Typography
          variant="body"
          color={colors.text.primary}
          style={styles.alertMessage}
        >
          {alert.message}
        </Typography>
        <View style={[styles.actionBadge, { backgroundColor: bgColor }]}>
          <Typography
            variant="caption"
            weight="bold"
            color={accentColor}
            style={{ fontSize: 10 }}
          >
            AÇÃO: {alert.actionRequired.toUpperCase()}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
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
              BOM DIA, THIAGO
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
              {renderMetricCard(
                "Total de Plantas",
                summary.totalPlants,
                Leaf,
                colors.success.main,
                colors.success.light,
              )}
              {renderMetricCard(
                "Atenção Necessária",
                summary.attentionNeeded,
                AlertTriangle,
                colors.danger.main,
                colors.danger.faded,
              )}
            </View>
            <View style={styles.metricsRow}>
              {renderMetricCard(
                "Umidade Média",
                `${summary.avgMoisture}%`,
                Droplets,
                colors.info.main,
                colors.info.light,
              )}
              {renderMetricCard(
                "Temp. Ambiente",
                `${summary.avgTemperature}°C`,
                Thermometer,
                colors.warning.main,
                colors.warning.faded,
              )}
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Typography variant="title" color={colors.text.primary}>
            Alertas da IA
          </Typography>
          {alerts.length > 0 && (
            <TouchableOpacity style={styles.seeAllButton}>
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
            {alerts.map(renderAlertCard)}
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
              Suas plantas estão saudáveis e sem alertas no momento.
            </Typography>
          </View>
        )}

        <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
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

  metricsGrid: {
    gap: 12,
    marginBottom: 32,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    marginBottom: 2,
  },
  metricTitle: {
    fontSize: 11,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  alertsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,

    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertMessage: {
    marginBottom: 12,
    lineHeight: 20,
  },
  actionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emptyAlerts: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: 32,
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
});
