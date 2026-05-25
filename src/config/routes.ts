import {
  Leaf,
  Sparkles,
  Home,
  User,
  Plus,
  PenLine,
  Bluetooth,
  Settings2,
  Lock,
  Settings,
} from "lucide-react-native";
import PlantDetailScreen from "../features/plants/screens/PlantDetailScreen";
import PlantListScreen from "../features/plants/screens/PlantListScreen";
import AddPlantScreen from "../features/plants/screens/AddPlantScreen";
import EditPlantScreen from "../features/plants/screens/EditPlantScreen";
import BluetoothSetupScreen from "../features/plants/screens/BluetoothSetupScreen";
import ManualControlScreen from "../features/plants/screens/ManualControlScreen";
import ChatScreen from "../features/chat/screens/ChatScreen";
import HomeScreen from "../features/home/screens/HomeScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import ChangePasswordScreen from "../features/profile/screens/ChangePasswordScreen";
import SettingsScreen from "../features/settings/screens/SettingsScreen";

export const HOME_ROUTES = [
  {
    name: "HomeMain",
    title: "Início",
    subtitle: "Visão geral e indicadores",
    icon: Home,
    component: HomeScreen,
  },
  {
    name: "AddPlant",
    title: "Cadastrar Planta",
    subtitle: "Sincronizar novo sensor",
    icon: Plus,
    component: AddPlantScreen,
  },
  {
    name: "PlantDetail",
    title: "Detalhes da Planta",
    subtitle: "Telemetria em tempo real",
    icon: Leaf,
    component: PlantDetailScreen,
  },
];

export const PLANTS_ROUTES = [
  {
    name: "PlantsMain",
    title: "Meu Cultivo",
    subtitle: "Monitoramento autônomo ativo",
    icon: Leaf,
    component: PlantListScreen,
  },
  {
    name: "PlantDetail",
    title: "Detalhes da Planta",
    subtitle: "Telemetria em tempo real",
    icon: Leaf,
    component: PlantDetailScreen,
  },
  {
    name: "AddPlant",
    title: "Cadastrar Planta",
    subtitle: "Sincronizar novo sensor",
    icon: Plus,
    component: AddPlantScreen,
  },
  {
    name: "EditPlant",
    title: "Editar Planta",
    subtitle: "Atualizar informações",
    icon: PenLine,
    component: EditPlantScreen,
  },
  {
    name: "BluetoothSetup",
    title: "Configuração Bluetooth",
    subtitle: "Sincronização de hardware",
    icon: Bluetooth,
    component: BluetoothSetupScreen,
  },
  {
    name: "ManualControl",
    title: "Controle Manual",
    subtitle: "Ajustes remotos do dispositivo",
    icon: Settings2,
    component: ManualControlScreen,
  },
];

export const CHAT_ROUTES = [
  {
    name: "ChatMain",
    title: "Chat IA",
    subtitle: "Assistente botânico virtual",
    icon: Sparkles,
    component: ChatScreen,
  },
];

export const PROFILE_ROUTES = [
  {
    name: "ProfileMain",
    title: "Perfil",
    subtitle: "Sua conta e preferências",
    icon: User,
    component: ProfileScreen,
  },
  {
    name: "ChangePassword",
    title: "Alterar Senha",
    subtitle: "Segurança da conta",
    icon: Lock,
    component: ChangePasswordScreen,
  },
];

export const SETTINGS_ROUTES = [
  {
    name: "SettingsMain",
    title: "Configurações",
    subtitle: "Preferências do aplicativo",
    icon: Settings,
    component: SettingsScreen,
  },
  {
    name: "ChangePassword",
    title: "Alterar Senha",
    subtitle: "Segurança da conta",
    icon: Lock,
    component: ChangePasswordScreen,
  },
];

export const TAB_ROUTES = [
  {
    name: "HomeTab",
    label: "Início",
    icon: Home,
    isStack: true,
    nestedRoutes: HOME_ROUTES,
  },
  {
    name: "PlantsTab",
    label: "Plantas",
    icon: Leaf,
    isStack: true,
    nestedRoutes: PLANTS_ROUTES,
  },
  {
    name: "ChatTab",
    label: "Chat IA",
    icon: Sparkles,
    isStack: true,
    nestedRoutes: CHAT_ROUTES,
  },
  {
    name: "ProfileTab",
    label: "Perfil",
    icon: User,
    isStack: true,
    nestedRoutes: PROFILE_ROUTES,
  },
  {
    name: "SettingsTab",
    label: "Config.",
    icon: Settings,
    isStack: true,
    nestedRoutes: SETTINGS_ROUTES,
  },
];
