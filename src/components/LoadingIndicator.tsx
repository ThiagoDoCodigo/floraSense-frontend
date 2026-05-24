import { useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { Typography, colors } from "react-native-th-components";
import { Leaf } from "lucide-react-native";

interface LoadingIndicatorProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function LoadingIndicator({
  message = "Carregando...",
  subMessage = "Aguarde um momento",
  fullScreen = true,
}: LoadingIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <ActivityIndicator
            size="large"
            color={colors.primary.main}
            style={styles.spinner}
          />
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Leaf size={24} color={colors.primary.main} />
          </Animated.View>
        </View>

        <Typography
          variant="body"
          weight="bold"
          color={colors.text.primary}
          style={styles.message}
          align="center"
        >
          {message}
        </Typography>

        {subMessage ? (
          <Typography
            variant="caption"
            color={colors.text.secondary}
            align="center"
          >
            {subMessage}
          </Typography>
        ) : null}
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
    minWidth: 220,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary.faded,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  spinner: {
    position: "absolute",
    transform: [{ scale: 1.5 }],
  },
  message: {
    marginBottom: 4,
    letterSpacing: -0.3,
  },
});
