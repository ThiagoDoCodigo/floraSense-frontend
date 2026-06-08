import { View, StyleSheet, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Clock, RefreshCw, RadioTower, WifiOff } from "lucide-react-native";
import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
  Button,
} from "react-native-th-components";
import { useManualControlViewModel } from "../viewModels/plants.viewModel";
import { InteractionManager, Platform } from "react-native";
import { useState, useEffect } from "react";
import { LoadingIndicator } from "../../../components/LoadingIndicator";

export default function ManualControlScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plantId, delayReading, isConnected } = route.params;
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
    if (Platform.OS === "web") {
      setIsReady(true);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!isConnected) {
    return (
      <View style={[styles.container, styles.offlineContainer]}>
        <View style={styles.offlineIconContainer}>
          <WifiOff size={42} color={colors.text.secondary} />
        </View>
        <Typography variant="title" style={styles.offlineTitle}>
          Módulo Não Pareado
        </Typography>
        <Typography
          variant="body"
          color={colors.text.secondary}
          style={[styles.offlineSubtitle, { marginBottom: 24 }]}
        >
          Essa planta ainda não possui um módulo FloraSense vinculado. Conecte
          um novo módulo agora para começar a receber diagnósticos da sua
          planta!
        </Typography>

        <Button
          label="Parear Módulo FloraSense"
          onPress={() => navigation.navigate("BluetoothSetup", { plantId })}
          style={{ width: "100%" }}
        />
      </View>
    );
  }

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
  offlineContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  offlineIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  offlineSubtitle: {
    textAlign: "center",
    lineHeight: 22,
  },
});
