import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, Appearance } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import * as Notifications from "expo-notifications";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  configureTheme,
  onThemeChange,
  ThemeMode,
  ThemeFamily,
} from "react-native-th-components";

const originalCreate = StyleSheet.create;
StyleSheet.create = (styles: any) => {
  const proxyStyles: any = {};
  for (const key in styles) {
    Object.defineProperty(proxyStyles, key, {
      get() {
        const styleObj =
          typeof styles[key] === "function" ? styles[key]() : styles[key];
        const evaluatedStyle: any = {};
        for (const prop in styleObj) {
          if (
            styleObj[prop] &&
            typeof styleObj[prop] === "object" &&
            !Array.isArray(styleObj[prop])
          ) {
            evaluatedStyle[prop] = { ...styleObj[prop] };
          } else {
            evaluatedStyle[prop] = styleObj[prop];
          }
        }
        return originalCreate({ style: evaluatedStyle }).style;
      },
      enumerable: true,
      configurable: true,
    });
  }
  return proxyStyles;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appKey, setAppKey] = useState(0);

  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const savedMode =
          (await AsyncStorage.getItem("@theme_preference")) || "auto";
        const savedFamily =
          (await AsyncStorage.getItem("@theme_family")) || "default";

        configureTheme({
          themeName: savedMode as ThemeMode,
          themeFamily: savedFamily as ThemeFamily,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }

    loadThemeSettings();

    onThemeChange(() => {
      setAppKey((prev) => prev + 1);
    });
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      key={`app-root-theme-${appKey}`}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
