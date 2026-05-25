import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors, Typography } from "react-native-th-components";
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
          headerTintColor: colors.text.primary,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {routes.map((route, index) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={WithMainLayout(route.component)}
            options={({ navigation }: any) => ({
              headerTitleAlign: index === 0 ? "left" : "left",
              headerTitle: () => (
                <View style={[styles.customHeaderContainer]}>
                  {route.icon && (
                    <View style={styles.headerIconBg}>
                      <route.icon size={20} color={colors.primary.main} />
                    </View>
                  )}
                  <View style={{ justifyContent: "center" }}>
                    <Typography
                      variant="body"
                      weight="bold"
                      color={colors.text.primary}
                      style={{ lineHeight: 18 }}
                    >
                      {route.title}
                    </Typography>

                    {route.subtitle && (
                      <Typography
                        variant="caption"
                        color={colors.text.secondary}
                        style={{ fontSize: 11, lineHeight: 14 }}
                      >
                        {route.subtitle}
                      </Typography>
                    )}
                  </View>
                </View>
              ),
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
    marginRight: 8,
    padding: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  customHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBg: {
    backgroundColor: colors.primary.faded,
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
});
