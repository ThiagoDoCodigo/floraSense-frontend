import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Leaf, Plus } from "lucide-react-native";

import { Button, colors, AlertMessage } from "react-native-th-components";
import { usePlantListViewModel } from "../viewModels/plants.viewModel";
import { Plant, PlantPhaseEnum } from "../models/plant.model";
import { EmptyState } from "../../../components/EmptyState";
import CustomCard from "../../../components/CustomCard";
import { phaseTranslations } from "../utils/translatePlantValues";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { ErrorIndicator } from "../../../components/ErrorIndicator";

export default function PlantListScreen() {
  const navigation = useNavigation<any>();
  const { plants, loading, loadingMore, error, loadMore, refresh, clearError } =
    usePlantListViewModel();

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  content: { flex: 1 },
  listContent: { paddingBottom: 24 },
  loader: { marginVertical: 16 },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
