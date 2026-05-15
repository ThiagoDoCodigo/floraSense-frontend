import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { colors } from "react-native-th-components";
import { Typography } from "react-native-th-components";

interface CustomCardProps {
  title: string;
  description: string;
  image?: string;
  subDescription?: string;
  subIcon?: LucideIcon;
  onPressBottom?: () => void;
  bottomButtonText?: string;
  onPressRight?: () => void;
  rightIcon?: LucideIcon;
}

export default function CustomCard({
  title,
  description,
  image,
  subDescription,
  subIcon: SubIcon,
  onPressBottom,
  bottomButtonText = "Acessar Diagnóstico",
  onPressRight,
  rightIcon: RightIcon,
}: CustomCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPressBottom}
      style={styles.card}
    >
      <View style={styles.container}>
        {image && (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.headerRow}>
            {RightIcon && onPressRight && (
              <TouchableOpacity
                onPress={onPressRight}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <RightIcon size={18} color={colors.text.muted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.textGroup}>
            <Typography
              variant="title"
              color={colors.text.primary}
              style={styles.title}
              numberOfLines={1}
            >
              {title}
            </Typography>
            <View style={styles.eyebrow}>
              {SubIcon && (
                <View style={styles.eyebrowIcon}>
                  <SubIcon size={12} color={colors.primary.main} />
                </View>
              )}
              {subDescription && (
                <Typography
                  variant="caption"
                  weight="bold"
                  color={colors.primary.main}
                  style={styles.eyebrowText}
                  numberOfLines={1}
                >
                  {subDescription.toUpperCase()}
                </Typography>
              )}
            </View>
            <Typography
              variant="body"
              italic={true}
              color={colors.text.secondary}
              style={styles.description}
              numberOfLines={1}
            >
              {description || "Sem descrição"}
            </Typography>
          </View>

          {onPressBottom && (
            <View style={styles.actionRow}>
              <Typography
                variant="caption"
                weight="bold"
                color={colors.primary.main}
                style={styles.actionText}
              >
                {bottomButtonText}
              </Typography>
              <ChevronRight size={14} color={colors.primary.main} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: colors.surfaceHighlight,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    height: 110,
    justifyContent: "space-between",
    paddingVertical: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyebrowIcon: {
    marginRight: 4,
  },
  eyebrowText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },

  textGroup: {
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.7,
    borderTopColor: colors.border,
    paddingTop: 6,
    marginBottom: 2,
  },
  actionText: {
    marginRight: 4,
  },
});
