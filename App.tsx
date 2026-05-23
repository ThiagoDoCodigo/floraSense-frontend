import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { configureTheme } from "react-native-th-components";
import { AuthProvider } from "./src/contexts/AuthContext";

configureTheme({
  themeName: "default",
});

/* 
// Opção B: Injetando cores totalmente customizadas do seu aplicativo
configureTheme({
  customColors: {
    primary: { main: '#FF0055', light: '#FF99BB', faded: '#FFECF2' },
    background: '#121212'
  }
});
*/

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
