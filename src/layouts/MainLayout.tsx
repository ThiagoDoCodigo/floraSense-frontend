import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from 'react-native-th-components'

interface MainLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function MainLayout({ children, style }: MainLayoutProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: fadeAnim,
          paddingBottom: insets.bottom,
          paddingLeft: Math.max(insets.left, 14),
          paddingRight: Math.max(insets.right, 14), 
        },
        style
      ]} 
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 12,
  }
});