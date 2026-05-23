import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthRoutes } from "./navigators/AuthRoutes";
import { MainTabs } from "./navigators/MainTabs";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "react-native-th-components";

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="MainFlow" component={MainTabs} />
      ) : (
        <RootStack.Screen name="AuthFlow" component={AuthRoutes} />
      )}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});