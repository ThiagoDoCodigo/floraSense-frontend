import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Typography, colors } from "react-native-th-components";
import {
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Leaf,
  Droplets,
  Thermometer,
  CloudRain,
  Activity,
  Clock,
  ArrowRight,
} from "lucide-react-native";
import type {
  DashboardAlert,
  LevelUrgentEnum,
} from "../../src/features/home/models/home.model";

interface AlertCardProps {
  alert: DashboardAlert;
  onPress: (alert: DashboardAlert) => void;
}

const getUrgencyConfig = (level: LevelUrgentEnum | null) => {
  switch (level) {
    case "CRITICAL":
      return {
        accent: colors.danger.main,
        bg: colors.danger.faded,
        Icon: AlertTriangle,
        label: "Crítico",
      };
    case "HIGH":
      return {
        accent: colors.warning.main,
        bg: colors.warning.faded,
        Icon: AlertCircle,
        label: "Atenção",
      };
    case "MEDIUM":
      return {
        accent: colors.info.main,
        bg: colors.info.light,
        Icon: Sparkles,
        label: "Moderado",
      };
    case "LOW":
    default:
      return {
        accent: colors.primary.main,
        bg: colors.primary.faded,
        Icon: Leaf,
        label: "Estável",
      };
  }
};

export function AlertCard({ alert, onPress }: AlertCardProps) {
  const urgency = getUrgencyConfig(alert.levelUrgent);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.alertCard, { borderColor: urgency.accent }]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.alertHeader}>
        <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}>
          <urgency.Icon size={12} color={urgency.accent} />
          <Typography
            variant="caption"
            weight="bold"
            color={urgency.accent}
            style={{ marginLeft: 4, fontSize: 10 }}
          >
            {urgency.label.toUpperCase()}
          </Typography>
        </View>

        <View style={styles.reportTimeBox}>
          <Clock size={14} color={colors.text.secondary} />
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.secondary}
            style={{ marginLeft: 6 }}
          >
            {new Date(alert.created_at).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </View>
      </View>

      <View style={styles.plantInfoRow}>
        <Typography variant="body" weight="bold" color={colors.text.primary}>
          {alert.plant?.name || "Planta Desconhecida"}
        </Typography>
        {alert.plant?.especie && (
          <Typography
            variant="caption"
            color={colors.text.secondary}
            style={{ marginLeft: 6, fontStyle: "italic" }}
          >
            • {alert.plant.especie}
          </Typography>
        )}
      </View>

      <View style={styles.reportTelemetry}>
        <View style={styles.reportTelemetryItem}>
          <Droplets size={16} color={colors.info.main} />
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 4 }}
          >
            {alert.soilMoisture}%
          </Typography>
        </View>
        <View style={styles.reportTelemetryItem}>
          <Thermometer size={16} color={colors.warning.main} />
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 4 }}
          >
            {alert.temperature}°C
          </Typography>
        </View>
        <View style={styles.reportTelemetryItem}>
          <CloudRain size={16} color={colors.primary.main} />
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 4 }}
          >
            {alert.airHumidity}%
          </Typography>
        </View>
        <View style={styles.reportTelemetryItem}>
          <Activity size={16} color={colors.success.main} />
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 4 }}
          >
            {alert.nitrogen}-{alert.phosphorus}-{alert.potassium}
          </Typography>
        </View>
      </View>

      <View style={styles.dashedDivider} />

      <Typography
        variant="body"
        color={colors.text.secondary}
        style={styles.alertMessage}
        numberOfLines={4}
      >
        {alert.aiDiagnosis}
      </Typography>

      <View style={styles.cardBTN}>
        <Typography variant="caption" weight="bold" color={urgency.accent}>
          TOQUE PARA VER A SOLUÇÃO COMPLETA
        </Typography>
        <ArrowRight size={16} color={urgency.accent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 12,
  },
  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  reportTimeBox: { flexDirection: "row", alignItems: "center" },
  plantInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reportTelemetry: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  reportTelemetryItem: { flexDirection: "row", alignItems: "center" },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
    borderStyle: "dashed",
    marginBottom: 12,
  },
  alertMessage: { marginBottom: 8, lineHeight: 20 },
  cardBTN: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
});
