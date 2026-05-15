import { Leaf, Sparkles, Home } from "lucide-react-native";
import PlantDetailScreen from "../features/plants/screens/PlantDetailScreen";
import PlantListScreen from "../features/plants/screens/PlantListScreen";
import AddPlantScreen from "../features/plants/screens/AddPlantScreen";
import EditPlantScreen from "../features/plants/screens/EditPlantScreen";
import BluetoothSetupScreen from "../features/plants/screens/BluetoothSetupScreen";
import ManualControlScreen from "../features/plants/screens/ManualControlScreen";
import ChatScreen from "../features/chat/screens/ChatScreen";
import HomeScreen from "../features/home/screens/HomeScreen";

export const HOME_ROUTES = [
  {
    name: "HomeMain",
    title: "Início",
    component: HomeScreen,
  },
  {
    name: "AddPlant",
    title: "Cadastrar Planta",
    component: AddPlantScreen,
  },
];

export const PLANTS_ROUTES = [
  {
    name: "PlantsMain",
    title: "Plantas",
    component: PlantListScreen,
  },
  {
    name: "PlantDetail",
    title: "Detalhes da Planta",
    component: PlantDetailScreen,
  },
  {
    name: "AddPlant",
    title: "Cadastrar Planta",
    component: AddPlantScreen,
  },
  {
    name: "EditPlant",
    title: "Editar Planta",
    component: EditPlantScreen,
  },
  {
    name: "BluetoothSetup",
    title: "Configuração Bluetooth",
    component: BluetoothSetupScreen,
  },
  {
    name: "ManualControl",
    title: "Controle Manual",
    component: ManualControlScreen,
  },
];

export const CHAT_ROUTES = [
  {
    name: "ChatMain",
    title: "Chat",
    component: ChatScreen,
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
];
