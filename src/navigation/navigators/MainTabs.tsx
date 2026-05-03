import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_ROUTES } from '../../config/routes';
import WithMainLayout from '../../layouts/helper/WithMainLayout';
import { CustomTabBar } from '../components/CustomTabBar';

import { stackComponents } from './NestedStacks';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
    {TAB_ROUTES.map((route: any) => (
        <Tab.Screen 
          key={route.name}
          name={route.name}
          component={route.isStack ? stackComponents[route.name] : WithMainLayout(route.component)}
        />
      ))}
    </Tab.Navigator>
  );
}