import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { X, Filter } from "lucide-react-native";
import {
  Typography,
  InputField,
  Button,
  colors,
} from "react-native-th-components";
import {
  FilterOptions,
  PlantPhaseEnum,
} from "../features/plants/models/plant.model";
import { phaseTranslations } from "../features/plants/utils/translatePlantValues";

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
};

export function PlantFilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}: Props) {
  const [name, setName] = useState(currentFilters.name || "");
  const [especie, setEspecie] = useState(currentFilters.especie || "");
  const [phaseOfLife, setPhaseOfLife] = useState<PlantPhaseEnum | "">(
    currentFilters.phaseOfLife || "",
  );

  useEffect(() => {
    if (visible) {
      setName(currentFilters.name || "");
      setEspecie(currentFilters.especie || "");
      setPhaseOfLife(currentFilters.phaseOfLife || "");
    }
  }, [visible, currentFilters]);

  const handleClear = () => {
    setName("");
    setEspecie("");
    setPhaseOfLife("");
    onApply({});
    onClose();
  };

  const handleApply = () => {
    onApply({
      name: name.trim(),
      especie: especie.trim(),
      phaseOfLife,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Filter
                size={24}
                color={colors.text.primary}
                style={{ marginRight: 8 }}
              />
              <Typography variant="title">Filtrar Plantas</Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <InputField
              label="Nome ou Apelido"
              placeholder="Ex: Espada de São Jorge"
              value={name}
              onChangeText={setName}
            />

            <InputField
              label="Espécie"
              placeholder="Ex: Sansevieria"
              value={especie}
              onChangeText={setEspecie}
            />

            <Typography variant="body" style={styles.label}>
              Fase da Vida
            </Typography>
            <View style={styles.chipsContainer}>
              {Object.values(PlantPhaseEnum).map((phase) => {
                const isSelected = phaseOfLife === phase;
                return (
                  <TouchableOpacity
                    key={phase as PlantPhaseEnum}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setPhaseOfLife(isSelected ? "" : phase)}
                  >
                    <Typography
                      variant="body"
                      color={
                        isSelected
                          ? colors.primary.faded
                          : colors.text.secondary
                      }
                    >
                      {phaseTranslations[phase as PlantPhaseEnum]}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Limpar"
              variant="outline"
              onPress={handleClear}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button label="Filtrar" onPress={handleApply} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    marginBottom: 24,
  },
  label: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: "bold",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
});
