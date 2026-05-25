import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Droplets,
  Thermometer,
  BrainCircuit,
  Activity,
  Settings2,
  Bluetooth,
  PenLine,
  Clock,
} from "lucide-react-native";

import { Typography, colors, AlertMessage } from "react-native-th-components";
import { usePlantDashboardViewModel } from "../viewModels/plants.viewModel";
import { PlantPhaseEnum, SensorReading } from "../models/plant.model";
import { EmptyState } from "../../../components/EmptyState";
import { phaseTranslations } from "../utils/translatePlantValues";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { ErrorIndicator } from "../../../components/ErrorIndicator";

export default function PlantDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plantId } = route.params;

  const {
    plant,
    readings,
    loading,
    loadingMore,
    error,
    clearError,
    loadMoreReadings,
    refresh,
  } = usePlantDashboardViewModel(plantId);

  if (loading && !plant) {
    return (
      <LoadingIndicator
        message="Acessando telemetria..."
        subMessage="Buscando informações da sua planta"
        fullScreen={true}
      />
    );
  }

  if (error && !plant) {
    return (
      <ErrorIndicator
        title="Oops! Falha na conexão"
        message={error}
        onRetry={() => refresh()}
        fullScreen={true}
      />
    );
  }

  const latestReading = readings?.length > 0 ? readings[0] : null;

  const renderHeader = () => {
    if (!plant) return null;
    return (
      <View style={styles.headerSection}>
        <View style={styles.heroContainer}>
          {plant.imageUrl ? (
            <Image source={{ uri: plant.imageUrl }} style={styles.heroImage} />
          ) : (
            <View
              style={[
                styles.heroImage,
                { backgroundColor: colors.primary.faded },
              ]}
            />
          )}
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Typography
                variant="caption"
                weight="bold"
                color={colors.text.inverse}
              >
                {plant.especie.toUpperCase()}
              </Typography>
            </View>
            <Typography
              variant="h1"
              color={colors.text.inverse}
              style={styles.heroTitle}
            >
              {plant.name}
            </Typography>
            <Typography
              variant="caption"
              color={colors.text.inverse}
              style={{ opacity: 0.8 }}
            >
              {phaseTranslations[plant.phaseOfLife as PlantPhaseEnum]}
            </Typography>
          </View>
        </View>

        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={styles.controlWidget}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("BluetoothSetup", { plantId })}
          >
            <View
              style={[
                styles.controlIconBg,
                { backgroundColor: colors.info.light },
              ]}
            >
              <Bluetooth size={24} color={colors.info.main} />
            </View>
            <Typography
              variant="caption"
              weight="bold"
              color={colors.text.primary}
              style={styles.controlText}
            >
              Conectar
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlWidget}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ManualControl", { plantId })}
          >
            <View
              style={[
                styles.controlIconBg,
                { backgroundColor: colors.warning.faded },
              ]}
            >
              <Settings2 size={24} color={colors.warning.main} />
            </View>
            <Typography
              variant="caption"
              weight="bold"
              color={colors.text.primary}
              style={styles.controlText}
            >
              Controles
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlWidget}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("EditPlant", { plant })}
          >
            <View
              style={[
                styles.controlIconBg,
                { backgroundColor: colors.primary.faded },
              ]}
            >
              <PenLine size={24} color={colors.primary.main} />
            </View>
            <Typography
              variant="caption"
              weight="bold"
              color={colors.text.primary}
              style={styles.controlText}
            >
              Editar
            </Typography>
          </TouchableOpacity>
        </View>

        {latestReading && (
          <View style={styles.liveStatusContainer}>
            <View style={styles.liveStatusHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Typography
                  variant="caption"
                  weight="bold"
                  color={colors.success.main}
                >
                  ÚLTIMA LEITURA
                </Typography>
              </View>
            </View>

            <View style={styles.liveGrid}>
              <View style={styles.liveItem}>
                <Droplets size={22} color={colors.info.main} />
                <Typography
                  variant="h2"
                  color={colors.text.primary}
                  style={styles.liveValue}
                >
                  {latestReading.soilMoisture}%
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Umidade
                </Typography>
              </View>
              <View style={styles.liveDivider} />
              <View style={styles.liveItem}>
                <Thermometer size={22} color={colors.warning.main} />
                <Typography
                  variant="h2"
                  color={colors.text.primary}
                  style={styles.liveValue}
                >
                  {latestReading.temperature}°C
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Ar
                </Typography>
              </View>
              <View style={styles.liveDivider} />
              <View style={styles.liveItem}>
                <Activity size={22} color={colors.success.main} />
                <Typography
                  variant="h2"
                  color={colors.text.primary}
                  style={styles.liveValue}
                >
                  {latestReading.nitrogen}-{latestReading.phosphorus}-
                  {latestReading.potassium}
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  NPK
                </Typography>
              </View>
            </View>
          </View>
        )}

        <View style={styles.historyHeader}>
          <Typography variant="title" color={colors.text.primary}>
            Relatórios da IA
          </Typography>
        </View>
      </View>
    );
  };

  const renderReading = ({ item }: { item: SensorReading }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportTimeBox}>
          <Clock size={14} color={colors.text.secondary} />
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.secondary}
            style={{ marginLeft: 6 }}
          >
            {new Date(item.created_at).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </View>
      </View>

      <View style={styles.reportTelemetry}>
        <View style={styles.reportTelemetryItem}>
          <Droplets size={16} color={colors.info.main} />
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 6 }}
          >
            {item.soilMoisture}%
          </Typography>
        </View>
        <View style={styles.reportTelemetryItem}>
          <Thermometer size={16} color={colors.warning.main} />
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 6 }}
          >
            {item.temperature}°C
          </Typography>
        </View>
        <View style={styles.reportTelemetryItem}>
          <Activity size={16} color={colors.success.main} />
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.primary}
            style={{ marginLeft: 6 }}
          >
            {item.nitrogen}-{item.phosphorus}-{item.potassium}
          </Typography>
        </View>
      </View>

      <View style={styles.dashedDivider} />

      <View style={styles.aiSection}>
        <View style={styles.aiTitleRow}>
          <BrainCircuit size={18} color={colors.primary.main} />
          <Typography
            variant="body"
            weight="bold"
            color={colors.primary.main}
            style={{ marginLeft: 8 }}
          >
            Diagnóstico
          </Typography>
        </View>
        <Typography
          variant="body"
          color={colors.text.secondary}
          style={styles.aiText}
        >
          {item.aiDiagnosis}
        </Typography>

        <View style={styles.recommendationBox}>
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.primary}
          >
            SUGESTÃO DO SISTEMA
          </Typography>
          <Typography
            variant="body"
            color={colors.text.secondary}
            style={{ marginTop: 4 }}
          >
            {item.actionRecommended}
          </Typography>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {error && plant ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={clearError}
        />
      ) : null}

      <FlatList
        data={readings ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderReading}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="Nenhum dado recebido"
              message="Ainda não há relatórios da IA. Conecte seu hardware via Bluetooth para iniciar a telemetria."
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={loading && readings.length > 0}
        onEndReached={loadMoreReadings}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={colors.primary.main}
              style={{ margin: 16 }}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingBottom: 40 },
  headerSection: { paddingTop: 16 },
  heroContainer: {
    width: "100%",
    height: 260,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: colors.surfaceHighlight,
  },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  heroTitle: { fontSize: 28, marginBottom: 4, letterSpacing: -0.5 },
  controlsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  controlWidget: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  controlIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  controlText: { letterSpacing: 0.5 },
  liveStatusContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  liveStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success.light,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success.main,
    marginRight: 6,
  },
  liveGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveItem: { alignItems: "center", flex: 1 },
  liveValue: { marginVertical: 4 },
  liveDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.surfaceHighlight,
  },
  historyHeader: { marginBottom: 16 },
  reportCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  reportHeader: {
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportTimeBox: { flexDirection: "row", alignItems: "center" },
  reportTelemetry: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  reportTelemetryItem: { flexDirection: "row", alignItems: "center" },
  dashedDivider: {
    height: 1,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
    borderStyle: "dashed",
  },
  aiSection: { padding: 16 },
  aiTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  aiText: { lineHeight: 22, marginBottom: 16 },
  recommendationBox: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
