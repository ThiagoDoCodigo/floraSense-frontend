import { StyleSheet, TouchableOpacity } from "react-native";
import { Typography, colors } from "react-native-th-components";

interface RenderChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  saving: boolean;
}

const RenderChip = ({
  label,
  isSelected,
  onPress,
  saving,
}: RenderChipProps) => (
  <TouchableOpacity
    style={[styles.chip, isSelected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={saving}
  >
    <Typography
      variant="caption"
      color={isSelected ? colors.text.inverse : colors.text.primary}
    >
      {label}
    </Typography>
  </TouchableOpacity>
);

export default RenderChip;

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
});
