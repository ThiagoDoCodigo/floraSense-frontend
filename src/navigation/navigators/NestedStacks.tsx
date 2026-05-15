import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "react-native-th-components";
import { TAB_ROUTES } from "../../config/routes";
import WithMainLayout from "../../layouts/helper/WithMainLayout";

const createNestedStack = (routes: any[]) => {
  const Stack = createStackNavigator();

  return function DynamicStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTitleAlign: "center",
          headerTintColor: colors.text.primary,
          headerTitleStyle: { fontWeight: "bold", fontSize: 16 },
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {routes.map((route, index) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={WithMainLayout(route.component)}
            options={({ navigation }: any) => ({
              title: route.title,
              headerLeft: () =>
                index === 0 ? null : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.canGoBack() && navigation.goBack()
                    }
                    style={styles.headerButton}
                  >
                    <ArrowLeft size={20} color={colors.text.secondary} />
                  </TouchableOpacity>
                ),
            })}
          />
        ))}
      </Stack.Navigator>
    );
  };
};

export const stackComponents: Record<string, React.ComponentType<any>> = {};

TAB_ROUTES.forEach((route) => {
  if (route.isStack && route.nestedRoutes) {
    stackComponents[route.name] = createNestedStack(route.nestedRoutes);
  }
});

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
});
