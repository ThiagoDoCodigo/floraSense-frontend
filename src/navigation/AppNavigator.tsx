import { createStackNavigator } from "@react-navigation/stack";
import { AuthRoutes } from "./navigators/AuthRoutes";
import { MainTabs } from "./navigators/MainTabs";

const RootStack = createStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="AuthFlow" component={AuthRoutes} />
      <RootStack.Screen name="MainFlow" component={MainTabs} />
    </RootStack.Navigator>
  );
}
