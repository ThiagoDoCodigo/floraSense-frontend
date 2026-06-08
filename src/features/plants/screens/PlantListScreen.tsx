import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Leaf, Plus, Filter } from "lucide-react-native";
import { useState } from "react";

import {
  Button,
  colors,
  AlertMessage,
  Typography,
} from "react-native-th-components";
import { usePlantListViewModel } from "../viewModels/plants.viewModel";
import { Plant, PlantPhaseEnum } from "../models/plant.model";
import { EmptyState } from "../../../components/EmptyState";
import CustomCard from "../../../components/CustomCard";
import { phaseTranslations } from "../utils/translatePlantValues";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { ErrorIndicator } from "../../../components/ErrorIndicator";
import { PlantFilterModal } from "../../../components/PlantFilterModal";

export default function PlantListScreen() {
  const navigation = useNavigation<any>();
  const {
    plants,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh,
    clearError,
    filters,
    applyFilters,
  } = usePlantListViewModel();

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(
    (val) => val !== "",
  ).length;

  if (loading && plants.length === 0) {
    return (
      <LoadingIndicator
        message="Carregando seu cultivo..."
        subMessage="Buscando informações das suas plantas"
        fullScreen={true}
      />
    );
  }

  if (error && plants.length === 0) {
    return (
      <ErrorIndicator
        title="Oops! Falha na conexão"
        message={error}
        onRetry={() => refresh()}
        fullScreen={true}
      />
    );
  }

  const renderItem = ({ item }: { item: Plant }) => (
    <CustomCard
      title={item.name}
      description={item.especie}
      subDescription={`Período: ${phaseTranslations[item.phaseOfLife as PlantPhaseEnum]}`}
      subIcon={Leaf}
      image={item.imageUrl}
      bottomButtonText="Acessar Diagnósticos"
      onPressBottom={() =>
        navigation.navigate("PlantDetail", { plantId: item.id })
      }
    />
  );

  return (
    <View style={styles.container}>
      {error && plants.length > 0 ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={clearError}
        />
      ) : null}

      <View style={styles.content}>
        <View style={styles.filterContainer}>
          <Typography variant="title">Minhas Plantas</Typography>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive,
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter
              size={20}
              color={
                activeFiltersCount > 0
                  ? colors.primary.main
                  : colors.text.secondary
              }
            />

            {activeFiltersCount > 0 && (
              <View style={styles.badge}>
                <Typography variant="body" style={styles.badgeText}>
                  {activeFiltersCount}
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onRefresh={refresh}
          refreshing={loading && plants.length > 0}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color={colors.primary.main}
                style={styles.loader}
              />
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title="Seu cultivo está vazio"
                message="Toque em 'Adicionar Nova Planta' para começar a monitorar."
              />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={[colors.primary.main]}
            />
          }
        />
      </View>

      <View style={styles.footer}>
        <Button
          label="Adicionar Nova Planta"
          iconPosition="left"
          icon={Plus}
          onPress={() => navigation.navigate("AddPlant")}
        />
      </View>
      <PlantFilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        currentFilters={filters}
        onApply={(newFilters) => applyFilters(newFilters)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 12 },
  content: { flex: 1 },
  listContent: { paddingBottom: 24 },
  loader: { marginVertical: 16 },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: `${colors.primary.main}1A`,
    borderColor: colors.primary.main,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.primary.main,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  badgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    lineHeight: 12,
  },
});
