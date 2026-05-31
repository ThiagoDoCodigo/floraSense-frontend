import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Leaf, Camera, Info, Plus } from "lucide-react-native";

import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useAddPlantViewModel } from "../viewModels/plants.viewModel";
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
import RenderChip from "../../../components/RenderChip";

export default function AddPlantScreen() {
  const navigation = useNavigation<any>();
  const {
    clearMessages,
    saving,
    error,
    success,
    fieldErrors,
    name,
    especie,
    imageUrl,
    phaseOfLife,
    environmentType,
    sunlightExposure,
    substrateType,
    savePlant,
    setName,
    setEspecie,
    setPhaseOfLife,
    setEnvironmentType,
    setSunlightExposure,
    setSubstrateType,
  } = useAddPlantViewModel();

  const handleSave = async () => {
    try {
      const isSuccess = await savePlant();
      if (isSuccess) {
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    } catch (e) {
      throw e;
    }
  };

  const handleImagePick = () => {
    console.log("Abrir galeria ou câmera para foto da planta");
  };

  return (
    <View style={styles.container}>
      {error ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={() => clearMessages()}
        />
      ) : null}
      {success ? (
        <AlertMessage
          title="Tudo Certo!"
          message={success}
          type="success"
          onClose={() => clearMessages()}
        />
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoBox}>
          <Info size={20} color={colors.info.main} />
          <Typography
            variant="caption"
            color={colors.text.secondary}
            style={styles.infoText}
          >
            A Inteligência Artificial do FloraSense usará essas informações para
            calibrar a leitura ideal dos sensores.
          </Typography>
        </View>

        <View style={styles.photoSection}>
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.primary}
            style={styles.photoLabel}
          >
            Foto da Planta (Recomendado)
          </Typography>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleImagePick}
            style={styles.photoBox}
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderBox}>
                <Camera size={32} color={colors.primary.main} />
                <Typography
                  variant="caption"
                  color={colors.primary.main}
                  style={{ marginTop: 8 }}
                >
                  Tirar ou escolher foto
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <InputField
            label="Apelido da Planta *"
            icon={Leaf}
            placeholder="Ex: Samambaia da Sala"
            value={name}
            onChangeText={setName}
            error={fieldErrors.name}
            editable={!saving}
          />
          <InputField
            label="Espécie Predominante *"
            icon={Leaf}
            placeholder="Ex: Samambaia, Cacto, Jiboia..."
            value={especie}
            onChangeText={setEspecie}
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
            {Object.values(PlantPhaseEnum).map((phase) => (
              <RenderChip
                key={phase}
                label={phaseTranslations[phase]}
                isSelected={phaseOfLife === phase}
                onPress={() => setPhaseOfLife(phase)}
                saving={saving}
              />
            ))}
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
            {Object.values(EnvironmentTypeEnum).map((env) => (
              <RenderChip
                key={env}
                label={environmentTranslations[env]}
                isSelected={environmentType === env}
                onPress={() => setEnvironmentType(env)}
                saving={saving}
              />
            ))}
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
            {Object.values(SunlightExposureEnum).map((sun) => (
              <RenderChip
                key={sun}
                label={sunlightTranslations[sun]}
                isSelected={sunlightExposure === sun}
                onPress={() => setSunlightExposure(sun)}
                saving={saving}
              />
            ))}
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
            {Object.values(SubstrateTypeEnum).map((sub) => (
              <RenderChip
                key={sub}
                label={substrateTranslations[sub]}
                isSelected={substrateType === sub}
                onPress={() => setSubstrateType(sub)}
                saving={saving}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label="Cadastrar Planta"
          onPress={handleSave}
          loadingLabel="Salvando base de dados..."
          successLabel="Planta Inserida!"
          icon={Plus}
          errorLabel="Erro ao cadastrar planta, tente novamente."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32, paddingTop: 16 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.info.light,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.info.main,
    marginBottom: 24,
    alignItems: "center",
  },
  infoText: { flex: 1, marginLeft: 12, lineHeight: 18 },
  photoSection: { marginBottom: 24 },
  photoLabel: { marginBottom: 12 },
  photoBox: {
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  placeholderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary.faded,
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  formSection: { gap: 8 },
  sectionLabel: { marginTop: 16, marginBottom: 8 },
  chipScroll: { flexDirection: "row", marginBottom: 8 },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
