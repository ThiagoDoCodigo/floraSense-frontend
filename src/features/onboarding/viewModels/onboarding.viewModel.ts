import { useState, useRef } from "react";
import { FlatList, ViewToken } from "react-native";
import { Leaf, Cpu, Sparkles, Sprout } from "lucide-react-native";
import type { OnboardingSlide } from "../models/onboarding.model";
import { useNavigation } from "@react-navigation/native";

export const useOnboardingViewModel = (slideWidth: number) => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      title: "Bem-vindo ao FloraSense!",
      description:
        "Descubra o nosso Sistema Autônomo de Monitoramento Botânico Guiado por IA. Diga adeus aos cuidados genéricos: o FloraSense cruza dados climáticos reais com o perfil biológico exato da sua espécie.",
      Icon: Leaf,
    },
    {
      id: "2",
      title: "Conexão Direta com a Terra",
      description:
        "O aplicativo se conecta a uma estação de sensores embarcados que extraem a umidade do solo, temperatura e NPK em tempo real. Acompanhe a saúde da sua planta e atue com prevenção ativa.",
      Icon: Cpu,
    },
    {
      id: "3",
      title: "Seu Agrônomo de Bolso",
      description:
        "Nossa interface conversacional via IA atua como um assistente, traduzindo uma telemetria complexa em sugestões fáceis de entender. Receba diagnósticos precisos e tire dúvidas em tempo real.",
      Icon: Sparkles,
    },
    {
      id: "4",
      title: "Prontos para cultivar o futuro?",
      description:
        "O cuidado com as suas plantas nunca mais será baseado em achismos. Cadastre sua primeira planta, calibre o sistema e deixe a inteligência artificial guiar suas mãos na terra. Vamos começar!",
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
    },
  ).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * slideWidth,
        animated: true,
      });
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
