import { View, StyleSheet } from "react-native";
import { Typography, colors, Button } from "react-native-th-components";
import { CloudOff, RefreshCw } from "lucide-react-native";

interface ErrorIndicatorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorIndicator({
  title = "Falha na Conexão",
  message = "Não foi possível carregar os dados no momento.",
  onRetry,
  fullScreen = true,
}: ErrorIndicatorProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <CloudOff size={32} color={colors.danger.main} />
        </View>

        <Typography
          variant="h2"
          color={colors.text.primary}
          style={styles.title}
          align="center"
        >
          {title}
        </Typography>

        <Typography
          variant="body"
          color={colors.text.secondary}
          align="center"
          style={styles.message}
        >
          {message}
        </Typography>

        {onRetry && (
          <Button
            label="Tentar Novamente"
            icon={RefreshCw}
            iconPosition="left"
            onPress={onRetry}
            style={styles.retryButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    width: "100%",
    maxWidth: 340,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.danger.faded,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    width: "100%",
  },
});
