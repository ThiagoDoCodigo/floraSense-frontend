import { View, StyleSheet, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Clock, RefreshCw, RadioTower } from "lucide-react-native";
import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useManualControlViewModel } from "../viewModels/plants.viewModel";
import { InteractionManager } from "react-native";
import { useState, useEffect } from "react";
import { LoadingIndicator } from "../../../components/LoadingIndicator";

export default function ManualControlScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plantId, delayReading } = route.params;
  const [isReady, setIsReady] = useState(false);
  const {
    interval,
    setInterval,
    loadingAction,
    error,
    success,
    updateInterval,
    forceReading,
    clearMessages,
  } = useManualControlViewModel(plantId, delayReading);

  const handleUpdateDelay = async () => {
    try {
      await updateInterval();
    } catch (e) {
      throw e;
    }
  };

  const handleForceRead = async () => {
    try {
      await forceReading();
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
      }, 2500);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!isReady) {
    return (
      <LoadingIndicator
        message="Carregando comandos..."
        subMessage="Aguarde um momento"
        fullScreen={true}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error ? (
        <AlertMessage
          title="Dispositivo Offline ou Ocupado"
          message={error}
          type="error"
          onClose={clearMessages}
        />
      ) : null}
      {success ? (
        <AlertMessage
          title="Comando Enviado"
          message={success}
          type="success"
          onClose={clearMessages}
        />
      ) : null}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Clock size={24} color={colors.warning.main} />
          <Typography variant="title" style={{ marginLeft: 8 }}>
            Intervalo de Medição
          </Typography>
        </View>
        <Typography
          variant="body"
          color={colors.text.secondary}
          style={{ marginBottom: 16 }}
        >
          Escolha de quanto em quanto tempo o dispositivo deve verificar a saúde
          da sua planta e atualizar os dados no aplicativo.
        </Typography>

        <InputField
          label="Tempo em Minutos (Mínimo: 15)"
          value={interval}
          onChangeText={setInterval}
          keyboardType="numeric"
          placeholder="Exemplo: 480 (para 8 horas)"
          editable={loadingAction === null}
        />
        <ActionButton
          label="Salvar Novo Intervalo"
          onPress={handleUpdateDelay}
          loadingLabel="Enviando para o dispositivo..."
          icon={Clock}
          iconPosition="right"
          errorLabel="Dispositivo Offline ou Ocupado"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <RadioTower size={24} color={colors.info.main} />
          <Typography variant="title" style={{ marginLeft: 8 }}>
            Leitura Imediata
          </Typography>
        </View>
        <Typography
          variant="body"
          color={colors.text.secondary}
          style={{ marginBottom: 16 }}
        >
          Solicite que o dispositivo verifique como a planta está agora mesmo,
          sem precisar esperar o tempo do próximo intervalo automático.
        </Typography>

        <ActionButton
          label="Verificar Planta Agora"
          onPress={handleForceRead}
          loadingLabel="Lendo os sensores..."
          icon={RefreshCw}
          variant="outline"
          errorLabel="Dispositivo Offline ou Ocupado"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingVertical: 16 },
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
