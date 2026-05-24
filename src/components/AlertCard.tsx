import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Typography, colors } from "react-native-th-components";
import { AlertTriangle, Activity, Leaf, Clock } from "lucide-react-native";
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
      };
    case "HIGH":
      return {
        accent: colors.warning.main,
        bg: colors.warning.faded,
        Icon: AlertTriangle,
      };
    case "MEDIUM":
      return {
        accent: colors.info.main,
        bg: colors.info.light,
        Icon: Activity,
      };
    case "LOW":
    default:
      return {
        accent: colors.primary.main,
        bg: colors.primary.faded,
        Icon: Leaf,
      };
  }
};

export function AlertCard({ alert, onPress }: AlertCardProps) {
  const { accent, bg, Icon } = getUrgencyConfig(alert.levelUrgent);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.alertCard, { borderColor: accent }]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleRow}>
          <Icon size={16} color={accent} />
          <Typography
            variant="caption"
            weight="bold"
            color={accent}
            style={{ marginLeft: 6 }}
          >
            {alert.plant?.name || "Atenção Requerida"}
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
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </View>
      </View>

      <Typography
        variant="body"
        color={colors.text.primary}
        style={styles.alertMessage}
      >
        {alert.aiDiagnosis}
      </Typography>

      <View style={[styles.actionBadge, { backgroundColor: bg }]}>
        <Typography
          variant="caption"
          weight="bold"
          color={accent}
          style={{ fontSize: 10 }}
        >
          AÇÃO: {alert.actionRecommended.toUpperCase()}
        </Typography>
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
    marginBottom: 8,
  },
  alertTitleRow: { flexDirection: "row", alignItems: "center" },
  reportTimeBox: { flexDirection: "row", alignItems: "center" },
  alertMessage: { marginBottom: 12, lineHeight: 20 },
  actionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
