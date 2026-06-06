import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  Typography,
  colors,
} from "react-native-th-components";
import { useOnboardingViewModel } from "../viewModels/onboarding.viewModel";
import type { OnboardingSlide } from "../models/onboarding.model";
import { ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const {
    slides,
    currentIndex,
    slidesRef,
    viewableItemsChanged,
    viewConfig,
    handleNext,
    handleSkip,
  } = useOnboardingViewModel();

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <item.Icon size={80} color={colors.primary.main} />
        </View>
        <Typography
          variant="h1"
          color={colors.text.primary}
          align="center"
          style={styles.title}
        >
          {item.title}
        </Typography>
        <Typography
          variant="body"
          color={colors.text.secondary}
          align="center"
          style={styles.description}
        >
          {item.description}
        </Typography>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={handleSkip}>
            <Typography variant="body" weight="bold" color={colors.text.muted}>
              Pular
            </Typography>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 24 }} />
        )}
      </View>

      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.paginator}>
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <Animated.View
                key={index.toString()}
                style={[
                  styles.dot,
                  isActive && styles.activeDot,
                  { width: isActive ? 24 : 8 }, 
                ]}
              />
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.8}
            onPress={handleNext}
          >
            <Typography weight="bold" color={colors.text.inverse} style={{ fontSize: 15 }}>
              {currentIndex === slides.length - 1 ? "Começar Agora" : "Próximo"}
            </Typography>
            {currentIndex < slides.length - 1 && (
              <ChevronRight size={18} color={colors.text.inverse} style={{ marginLeft: 8 }} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: "flex-end",
    height: 100,
  },
  slide: {
    width,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  paginator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.faded,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary.main,
  },
  buttonContainer: {
    width: "100%",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
  },
});
