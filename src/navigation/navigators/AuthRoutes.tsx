import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import WithMainLayout from "../../layouts/helper/WithMainLayout";
import LoginScreen from "../../features/auth/screens/LoginScreen";
import RegisterScreen from "../../features/auth/screens/RegisterScreen";
import RecoverScreen from "../../features/auth/screens/RecoverScreen";
import OnboardingScreen from "../../features/onboarding/screens/OnboardingScreen";

const AuthStack = createStackNavigator();

export function AuthRoutes() {
  return (
    <AuthStack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <AuthStack.Screen
        name="Onboarding"
        component={WithMainLayout(OnboardingScreen)}
      />
      <AuthStack.Screen name="Login" component={WithMainLayout(LoginScreen)} />
      <AuthStack.Screen
        name="Register"
        component={WithMainLayout(RegisterScreen)}
      />
      <AuthStack.Screen
        name="Recover"
        component={WithMainLayout(RecoverScreen)}
      />
    </AuthStack.Navigator>
  );
}
