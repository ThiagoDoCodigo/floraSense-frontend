import { StyleSheet, View } from "react-native";
import { LineChart, LucideIcon } from "lucide-react-native";
import { colors, Typography } from "react-native-th-components";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
}

export const EmptyState = ({
  title,
  message,
  icon: Icon = LineChart,
}: EmptyStateProps) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBox}>
        <Icon size={32} color={colors.text.muted} />
      </View>
      <Typography
        variant="title"
        color={colors.text.primary}
        style={{ marginTop: 16 }}
      >
        {title || "Nenhum dado recebido"}
      </Typography>
      <Typography
        variant="body"
        color={colors.text.secondary}
        align="center"
        style={{ marginTop: 8, paddingHorizontal: 24 }}
      >
        {message || "Ainda não há registros."}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    marginTop: 8,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceHighlight,
    alignItems: "center",
    justifyContent: "center",
  },
});
