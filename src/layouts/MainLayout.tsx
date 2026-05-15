import { useEffect, useRef } from "react";
import { Animated, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "react-native-th-components";

interface MainLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function MainLayout({ children, style }: MainLayoutProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
});
