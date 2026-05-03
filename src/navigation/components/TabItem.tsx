import { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from 'react-native-th-components';

export function TabItem({ isFocused, onPress, Icon, label }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        {Icon && (
          <Icon 
            size={22} 
            color={isFocused ? colors.primary.main : colors.text.muted} 
            style={{ marginBottom: 4 }}
          />
        )}
        <Text 
          style={[
            styles.tabLabel, 
            { 
              color: isFocused ? colors.primary.main : colors.text.muted,
              fontWeight: isFocused ? '600' : '400'
            }
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  tabLabel: {
    fontSize: 11,
  }
});