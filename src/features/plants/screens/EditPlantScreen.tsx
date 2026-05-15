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

export default function EditPlantScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plant } = route.params;

  const {
    name,
    setName,
    species,
    setSpecies,
    imageUrl,
    setImageUrl,
    saving,
    error,
    success,
    saveChanges,
    clearMessages,
  } = useEditPlantViewModel(plant);

  const handleSave = async () => {
    try {
      await saveChanges();
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
      }, 1500);
    } catch (e) {
      throw error;
    }
  };

  const handleImagePick = () => {
    console.log("Abrir galeria para trocar a foto da planta");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {error ? (
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
          <Typography variant="caption" weight="bold" color={colors.info.main}>
            Impacto no Diagnóstico
          </Typography>
          <Typography
            variant="caption"
            color={colors.text.secondary}
            style={{ marginTop: 2, lineHeight: 18 }}
          >
            Alterar a "Espécie Predominante" mudará a forma como a Inteligência
            Artificial avalia as leituras de umidade e NPK desta planta.
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
          />
          <InputField
            label="Espécie Predominante"
            icon={Leaf}
            value={species}
            onChangeText={setSpecies}
            placeholder="Ex: Samambaia, Cacto..."
          />
        </View>
      </View>

      <View style={styles.actionSection}>
        <ActionButton
          label="Salvar Alterações"
          onPress={handleSave}
          loadingLabel="Atualizando banco de dados..."
          successLabel="Atualizado!"
          iconPosition="right"
          icon={Save}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingVertical: 8 },

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

  actionSection: { paddingTop: 8 },
});
