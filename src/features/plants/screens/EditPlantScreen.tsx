import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Leaf, Camera, Info, Tag, Save } from "lucide-react-native";

import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useEditPlantViewModel } from "../viewModels/plants.viewModel";
import {
  PlantPhaseEnum,
  EnvironmentTypeEnum,
  SunlightExposureEnum,
  SubstrateTypeEnum,
} from "../models/plant.model";

import {
  phaseTranslations,
  environmentTranslations,
  sunlightTranslations,
  substrateTranslations,
} from "../utils/translatePlantValues";

import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { ErrorIndicator } from "../../../components/ErrorIndicator";

export default function EditPlantScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plant } = route.params;

  const {
    name,
    setName,
    especie,
    setEspecie,
    imageUrl,
    phaseOfLife,
    setPhaseOfLife,
    environmentType,
    setEnvironmentType,
    sunlightExposure,
    setSunlightExposure,
    substrateType,
    setSubstrateType,
    saving,
    error,
    success,
    saveChanges,
    clearMessages,
    fieldErrors,
  } = useEditPlantViewModel(plant);

  if (!plant && !name) {
    return (
      <LoadingIndicator
        message="Preparando edição..."
        subMessage="Carregando dados da planta"
        fullScreen={true}
      />
    );
  }

  if (error && !name && !fieldErrors.name) {
    return (
      <ErrorIndicator
        title="Oops! Falha na conexão"
        message={error}
        onRetry={() => clearMessages()}
        fullScreen={true}
      />
    );
  }

  const handleSave = async () => {
    const isSuccess = await saveChanges();
    if (isSuccess) {
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
      }, 1500);
    }
  };

  const handleImagePick = () => {
    console.log("Abrir galeria para trocar a foto da planta");
  };

  const renderChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void,
  ) => (
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

  return (
    <View style={styles.container}>
      {error && (name || fieldErrors.name) ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={clearMessages}
        />
      ) : null}
      {success ? (
        <AlertMessage
          title="Feito!"
          message={success}
          type="success"
          onClose={clearMessages}
        />
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleImagePick}
            style={styles.imageWrapper}
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.plantImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Leaf size={40} color={colors.primary.main} />
              </View>
            )}

            <View style={styles.editBadge}>
              <Camera size={18} color={colors.text.inverse} />
            </View>
          </TouchableOpacity>
          <Typography
            variant="caption"
            weight="bold"
            color={colors.primary.main}
            style={{ marginTop: 16 }}
          >
            ALTERAR FOTO
          </Typography>
        </View>

        <View style={styles.infoBanner}>
          <Info size={20} color={colors.info.main} style={{ marginTop: 2 }} />
          <View style={styles.infoTextContainer}>
            <Typography
              variant="caption"
              weight="bold"
              color={colors.info.main}
            >
              Impacto no Diagnóstico
            </Typography>
            <Typography
              variant="caption"
              color={colors.text.secondary}
              style={{ marginTop: 2, lineHeight: 18 }}
            >
              Alterar os dados afetará a forma como a Inteligência Artificial
              avalia as leituras de umidade e NPK desta planta.
            </Typography>
          </View>
        </View>

        <View style={styles.formSection}>
          <Typography
            variant="title"
            color={colors.text.primary}
            style={{ marginBottom: 16, marginLeft: 4 }}
          >
            Dados Básicos
          </Typography>

          <View style={styles.formCard}>
            <InputField
              label="Apelido da Planta"
              icon={Tag}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Minha Samambaia"
              error={fieldErrors.name}
              editable={!saving}
            />
            <InputField
              label="Espécie Predominante"
              icon={Leaf}
              value={especie}
              onChangeText={setEspecie}
              placeholder="Ex: Samambaia, Cacto..."
              error={fieldErrors.especie}
              editable={!saving}
            />

            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.sectionLabel}
            >
              Fase de Vida
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {Object.values(PlantPhaseEnum).map((phase) =>
                renderChip(
                  phaseTranslations[phase as PlantPhaseEnum],
                  phaseOfLife === phase,
                  () => setPhaseOfLife(phase as PlantPhaseEnum),
                ),
              )}
            </ScrollView>

            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.sectionLabel}
            >
              Ambiente
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {Object.values(EnvironmentTypeEnum).map((env) =>
                renderChip(
                  environmentTranslations[env as EnvironmentTypeEnum],
                  environmentType === env,
                  () => setEnvironmentType(env as EnvironmentTypeEnum),
                ),
              )}
            </ScrollView>

            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.sectionLabel}
            >
              Exposição Solar
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {Object.values(SunlightExposureEnum).map((sun) =>
                renderChip(
                  sunlightTranslations[sun as SunlightExposureEnum],
                  sunlightExposure === sun,
                  () => setSunlightExposure(sun as SunlightExposureEnum),
                ),
              )}
            </ScrollView>

            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.sectionLabel}
            >
              Tipo de Substrato
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {Object.values(SubstrateTypeEnum).map((sub) =>
                renderChip(
                  substrateTranslations[sub as SubstrateTypeEnum],
                  substrateType === sub,
                  () => setSubstrateType(sub as SubstrateTypeEnum),
                ),
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label="Salvar Alterações"
          onPress={handleSave}
          loadingLabel="Atualizando banco de dados..."
          successLabel="Atualizado!"
          iconPosition="right"
          icon={Save}
          errorLabel="Erro ao atualizar os dados da planta."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingVertical: 16, paddingBottom: 32 },
  photoSection: { alignItems: "center", marginTop: 16, marginBottom: 32 },
  imageWrapper: {
    position: "relative",
    width: 140,
    height: 140,
    borderRadius: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  plantImage: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  editBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary.main,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.background,
    elevation: 2,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: colors.info.light,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.info.main,
    marginBottom: 24,
  },
  infoTextContainer: { flex: 1, marginLeft: 12 },
  formSection: { marginBottom: 32 },
  formCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionLabel: { marginTop: 16, marginBottom: 8 },
  chipScroll: { flexDirection: "row", marginBottom: 8 },
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
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
