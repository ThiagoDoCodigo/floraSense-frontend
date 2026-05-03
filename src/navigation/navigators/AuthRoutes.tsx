import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import WithMainLayout from '../../layouts/helper/WithMainLayout';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import RegisterScreen from '../../features/auth/screens/RegisterScreen';
import RecoverScreen from '../../features/auth/screens/RecoverScreen';

const AuthStack = createStackNavigator();

export function AuthRoutes() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
      <AuthStack.Screen name="Login" component={WithMainLayout(LoginScreen)} />
      <AuthStack.Screen name="Register" component={WithMainLayout(RegisterScreen)} />
      <AuthStack.Screen name="Recover" component={WithMainLayout(RecoverScreen)} />
    </AuthStack.Navigator>
  );
}