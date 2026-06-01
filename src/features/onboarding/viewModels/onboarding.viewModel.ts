import { useState, useRef } from "react";
import { FlatList, ViewToken } from "react-native";
import { Leaf, Cpu, Sparkles, Sprout } from "lucide-react-native";
import type { OnboardingSlide } from "../models/onboarding.model";
import { useNavigation } from "@react-navigation/native";

export const useOnboardingViewModel = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      title: "Bem-vindo ao FloraSense!",
      description:
        "Descubra o nosso Sistema Autônomo de Monitoramento Botânico Guiado por IA. Diga adeus aos cuidados genéricos: o FloraSense cruza dados climáticos reais com o perfil biológico exato da sua espécie para oferecer um diagnóstico e manejo totalmente personalizados.",
      Icon: Leaf,
    },
    {
      id: "2",
      title: "Conexão Direta com a Terra",
      description:
        "O aplicativo se conecta a uma estação de sensores embarcados que extraem a umidade do solo, a temperatura do ar e os níveis nutricionais (NPK) em tempo real. Acompanhe a saúde da sua planta e atue com prevenção ativa, antecipando estados de estresse hídrico ou térmico antes que causem danos.",
      Icon: Cpu,
    },
    {
      id: "3",
      title: "Seu Agrônomo de Bolso",
      description:
        "Nossa interface conversacional via IA atua como um assistente de bolso, traduzindo uma telemetria complexa em sugestões fáceis de entender. Converse diretamente com a FloraSense AI para receber diagnósticos precisos, pedir orientações detalhadas de adubação ou sanar dúvidas sobre o seu cultivo em tempo real.",
      Icon: Sparkles,
    },
    {
      id: "4",
      title: "Prontos para cultivar o futuro?",
      description:
        "O cuidado com as suas plantas nunca mais será baseado em achismos. Cadastre sua primeira planta definindo a espécie, o ambiente e a exposição solar para calibrar o sistema perfeitamente. Deixe a inteligência artificial guiar suas mãos na terra. Vamos começar!",
      Icon: Sprout,
    },
  ];

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems &&
        viewableItems.length > 0 &&
        viewableItems[0].index !== null
      ) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login");
  };

  return {
    slides,
    currentIndex,
    slidesRef,
    viewableItemsChanged,
    viewConfig,
    handleNext,
    handleSkip,
  };
};
