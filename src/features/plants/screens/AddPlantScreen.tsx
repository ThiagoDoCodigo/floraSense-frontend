import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Leaf, Camera, Info, Tag, Plus } from "lucide-react-native";

import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
  ConfirmationModal,
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
  const [imageError, setImageError] = useState(false);

  const {
    clearMessages,
    saving,
    error,
    success,
    fieldErrors,
    name,
    especie,
    localImageUri,
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
    handleImagePick,
    imageRationaleVisible,
    imageBlockedVisible,
    handleRationaleConfirm,
    handleRationaleCancel,
    handleBlockedConfirm,
    handleBlockedCancel,
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

  const imageToDisplay = localImageUri;

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
        <View style={styles.photoSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleImagePick}
            style={styles.imageWrapper}
          >
            {imageToDisplay && !imageError ? (
              <Image
                source={{ uri: imageToDisplay }}
                style={styles.plantImage}
                onError={() => setImageError(true)}
              />
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
            ADICIONAR FOTO
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
              A Inteligência Artificial do FloraSense usará essas informações
              para calibrar a leitura ideal dos sensores.
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
              label="Apelido da Planta *"
              icon={Tag}
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

      <ConfirmationModal
        isOpen={imageRationaleVisible}
        onClose={handleRationaleCancel}
        onConfirm={handleRationaleConfirm}
        title="Acesso à Galeria"
        message="Para personalizar sua planta, o FloraSense precisa de acesso à sua galeria de fotos. Você autoriza?"
      />

      <ConfirmationModal
        isOpen={imageBlockedVisible}
        onClose={handleBlockedCancel}
        onConfirm={handleBlockedConfirm}
        title="Acesso Bloqueado"
        message="O acesso às fotos foi bloqueado. Para escolher uma imagem, abra as Configurações do seu aparelho e conceda a permissão."
        confirmText="Configurações"
        isDestructive={true}
      />
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
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
