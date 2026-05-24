import { View, StyleSheet } from "react-native";
import { Typography, colors } from "react-native-th-components";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
}

export function MetricCard({
  title,
  value,
  icon: IconComponent,
  color,
  bgColor,
}: MetricCardProps) {
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
}

const styles = StyleSheet.create({
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
  metricValue: { fontSize: 24, marginBottom: 2 },
  metricTitle: { fontSize: 11 },
});
