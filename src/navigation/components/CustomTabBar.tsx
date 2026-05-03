import { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from 'react-native-th-components';
import { TAB_ROUTES } from '../../config/routes';
import { TabItem } from './TabItem';

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const tabWidth = width / state.routes.length;
  const translateX = useRef(new Animated.Value(state.index * tabWidth)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <Animated.View 
        style={[
          styles.slidingIndicatorContainer, 
          { width: tabWidth, transform: [{ translateX }] }
        ]}
      >
        <View style={[styles.activeIndicator, { backgroundColor: colors.primary.main }]} />
      </Animated.View>

      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const routeConfig = TAB_ROUTES.find((r: any) => r.name === route.name);
        const Icon = routeConfig?.icon;
        const label = routeConfig?.label || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        return (
          <TabItem
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            Icon={Icon}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
    position: 'relative',
  },
  slidingIndicatorContainer: {
    position: 'absolute',
    top: -1,
    height: 3,
    alignItems: 'center',
    zIndex: 1,
  },
  activeIndicator: {
    width: '40%',
    height: '100%',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});