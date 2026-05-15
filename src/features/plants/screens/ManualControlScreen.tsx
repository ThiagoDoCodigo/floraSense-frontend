import { View, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Droplets, Clock } from "lucide-react-native";

import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useManualControlViewModel } from "../viewModels/plants.viewModel";

export default function ManualControlScreen() {
  const route = useRoute<any>();
  const { plantId } = route.params;

  const {
    volume,
    setVolume,
    interval,
    setInterval,
    loadingAction,
    error,
    success,
    waterPlant,
    updateInterval,
    clearMessages,
  } = useManualControlViewModel(plantId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error ? (
        <AlertMessage
          title="Falha no Comando"
          message={error}
          type="error"
          onClose={clearMessages}
        />
      ) : null}
      {success ? (
        <AlertMessage
          title="Comando Recebido"
          message={success}
          type="success"
          onClose={clearMessages}
        />
      ) : null}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Droplets size={24} color={colors.info.main} />
          <Typography variant="title" style={{ marginLeft: 8 }}>
            Acionamento da Bomba
          </Typography>
        </View>
        <Typography
          variant="body"
          color={colors.text.secondary}
          style={{ marginBottom: 16 }}
        >
          Acione a bomba d'água remotamente via MQTT. O sensor de fluxo cortará
          a energia quando o volume for atingido.
        </Typography>

        <InputField
          label="Volume de Água (ml)"
          value={volume}
          onChangeText={setVolume}
          keyboardType="numeric"
          placeholder="Ex: 200"
        />
        <ActionButton
          label="Irrigar Agora"
          onPress={waterPlant}
          loadingLabel="Enviando comando..."
          iconPosition="right"
          icon={Droplets}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Clock size={24} color={colors.warning.main} />
          <Typography variant="title" style={{ marginLeft: 8 }}>
            Ciclo de Diagnóstico
          </Typography>
        </View>
        <Typography
          variant="body"
          color={colors.text.secondary}
          style={{ marginBottom: 16 }}
        >
          De quanto em quanto tempo o ESP32 deve acordar, ler os sensores, tirar
          foto e enviar para a IA?
        </Typography>

        <InputField
          label="Intervalo em Minutos"
          value={interval}
          onChangeText={setInterval}
          keyboardType="numeric"
          placeholder="Ex: 60"
        />
        <ActionButton
          label="Salvar Ciclo"
          onPress={updateInterval}
          loadingLabel="Atualizando hardware..."
          icon={Clock}
          iconPosition="right"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingVertical: 32 },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
});
