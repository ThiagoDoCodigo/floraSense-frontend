import { Home, Settings, User } from 'lucide-react-native';
import HomeScreen from '../features/home/screens/HomeScreen';
import TestScreen from '../features/home/screens/TestScreen';

export const HOME_ROUTES = [
  {
    name: 'HomeMain',
    title: 'Início',
    component: HomeScreen,
  },
  {
    name: 'TestStack',
    title: 'Tela de Teste Interna',
    component: TestScreen,
  },
];

export const TAB_ROUTES = [
  {
    name: 'HomeTab',
    label: 'Início',
    icon: Home,
    isStack: true,
    nestedRoutes: HOME_ROUTES,
  },
  {
    name: 'ProfileTab',
    label: 'Perfil',
    icon: User,
    isStack: true,
    nestedRoutes: HOME_ROUTES
  },
];