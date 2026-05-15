import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Leaf, Plus } from "lucide-react-native";

import {
  Header,
  ActionButton,
  colors,
  AlertMessage,
  Typography,
} from "react-native-th-components";
import { usePlantListViewModel } from "../viewModels/plants.viewModel";
import type { Plant } from "../models/plant.model";
import { EmptyState } from "../../../components/EmptyState";
import CustomCard from "../../../components/CustomCard";

export default function PlantListScreen() {
  const navigation = useNavigation<any>();
  const { plants, loading, loadingMore, error, loadMore, refresh, clearError } =
    usePlantListViewModel();

  const renderItem = ({ item }: { item: Plant }) => (
    <CustomCard
      title={item.name}
      description={item.scientificName}
      subDescription={`Espécie: ${item.species}`}
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
      {error ? (
        <AlertMessage
          title="Erro"
          message={error}
          type="error"
          onClose={clearError}
        />
      ) : null}

      <Header
        title="Meu Cultivo"
        subtitle="Monitoramento autônomo ativo"
        icon={Leaf}
      />

      <View style={styles.content}>
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onRefresh={refresh}
          refreshing={loading}
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
            <EmptyState
              title="Seu cultivo está vazio"
              message="Toque em 'Adicionar Nova Planta' para começar a monitorar."
            />
          }
        />
      </View>

      <View style={styles.footer}>
        <ActionButton
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
  container: { flex: 1 },
  content: { flex: 1 },
  listContent: { paddingBottom: 24 },
  loader: { marginVertical: 16 },
  emptyState: { alignItems: "center", marginTop: 40 },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
