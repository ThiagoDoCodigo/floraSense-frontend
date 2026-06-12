import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Typography, colors } from "react-native-th-components";
import { useOnboardingViewModel } from "../viewModels/onboarding.viewModel";
import type { OnboardingSlide } from "../models/onboarding.model";
import { ChevronRight } from "lucide-react-native";

const PaginationDot = ({ isActive }: { isActive: boolean }) => {
  const activeColor = colors.primary.main;
  const inactiveColor = colors.primary.faded;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? 24 : 8, { duration: 300 }),
      backgroundColor: withTiming(isActive ? activeColor : inactiveColor, {
        duration: 300,
      }),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const slideWidth = width - 32;

  const {
    slides,
    currentIndex,
    slidesRef,
    viewableItemsChanged,
    viewConfig,
    handleNext,
    handleSkip,
  } = useOnboardingViewModel(slideWidth);

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width: slideWidth }]}>
        <View style={styles.contentWrapper}>
          <View style={styles.iconContainer}>
            <item.Icon
              size={56}
              color={colors.primary.main}
              strokeWidth={1.5}
            />
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Typography variant="body" weight="bold" color={colors.text.muted}>
              Pular
            </Typography>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      <View style={styles.listContainer}>
        <FlatList
          ref={slidesRef}
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          snapToInterval={slideWidth}
          snapToAlignment="center"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: slideWidth,
            offset: slideWidth * index,
            index,
          })}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.paginator}>
          {slides.map((_, index) => (
            <PaginationDot key={index} isActive={index === currentIndex} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Typography
            weight="bold"
            color={colors.text.inverse}
            style={styles.nextButtonText}
          >
            {currentIndex === slides.length - 1 ? "Começar Agora" : "Próximo"}
          </Typography>
          {currentIndex < slides.length - 1 && (
            <ChevronRight
              size={20}
              color={colors.text.inverse}
              style={{ marginLeft: 4 }}
              strokeWidth={2.5}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: Platform.OS === "ios" ? 110 : 80,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipPlaceholder: {
    height: 36,
  },
  listContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
    borderWidth: 1.5,
    borderColor: colors.primary.light,
  },
  title: {
    marginBottom: 16,
    lineHeight: 34,
    paddingHorizontal: 8,
  },
  description: {
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 32,
  },
  paginator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: colors.primary.main,
    borderRadius: 16,
    elevation: 2,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
