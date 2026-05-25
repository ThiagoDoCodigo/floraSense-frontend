import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Bluetooth,
  Wifi,
  KeyRound,
  CheckCircle2,
  Cpu,
  RefreshCw,
  SmartphoneNfc,
  Unplug,
  Clock,
} from "lucide-react-native";

import {
  InputField,
  ActionButton,
  Typography,
  Button,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useBluetoothSetupViewModel } from "../viewModels/plants.viewModel";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { ErrorIndicator } from "../../../components/ErrorIndicator";

export default function BluetoothSetupScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plantId } = route.params;

  const {
    step,
    plant,
    isScanning,
    devices,
    connectedDevice,
    isConnecting,
    ssid,
    setSsid,
    password,
    setPassword,
    pairing,
    disconnecting,
    error,
    success,
    scanDevices,
    loadData,
    connectToDevice,
    pairDevice,
    unpairDevice,
    clearMessages,
  } = useBluetoothSetupViewModel(plantId);

  const handlePair = async () => {
    const ok = await pairDevice();
    if (ok) {
      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
      }, 2000);
    }
  };

  if (step === "loading") {
    return (
      <LoadingIndicator
        message="Verificando Hardware..."
        subMessage="Checando conexões do dispositivo"
        fullScreen={true}
      />
    );
  }

  if (step === "error") {
    return (
      <ErrorIndicator
        title="Falha na Conexão"
        message={error}
        onRetry={loadData}
        fullScreen={true}
      />
    );
  }

  const renderConnectedStep = () => (
    <View style={styles.stepContainer}>
      <View
        style={[
          styles.infoBox,
          {
            borderColor: colors.success.main,
            backgroundColor: colors.success.light,
          },
        ]}
      >
        <Cpu
          size={40}
          color={colors.success.main}
          style={{ marginBottom: 16 }}
        />
        <Typography variant="h2" align="center" color={colors.success.main}>
          Dispositivo Ativo
        </Typography>
        <Typography
          variant="body"
          color={colors.text.secondary}
          align="center"
          style={{ marginTop: 8 }}
        >
          Seu módulo FloraSense está conectado e enviando telemetria para a
          nuvem.
        </Typography>
      </View>

      <View style={styles.detailsContainer}>
        <Typography variant="title" style={{ marginBottom: 16 }}>
          Detalhes da Conexão
        </Typography>

        <View style={styles.detailRow}>
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.secondary}
          >
            Endereço MAC
          </Typography>
          <Typography variant="body" color={colors.text.primary}>
            {plant?.macAddress || "Desconhecido"}
          </Typography>
        </View>
        <View style={styles.detailDivider} />

        <View style={styles.detailRow}>
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.secondary}
          >
            Firmware
          </Typography>
          <Typography variant="body" color={colors.text.primary}>
            {plant?.firmwareVersion || "v1.0.0"}
          </Typography>
        </View>
        <View style={styles.detailDivider} />

        <View style={styles.detailRow}>
          <Typography
            variant="body"
            weight="bold"
            color={colors.text.secondary}
          >
            Conectado em
          </Typography>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock
              size={14}
              color={colors.text.muted}
              style={{ marginRight: 6 }}
            />
            <Typography variant="body" color={colors.text.primary}>
              {plant?.lastConnectionDate
                ? new Date(plant.lastConnectionDate).toLocaleDateString("pt-BR")
                : "Recente"}
            </Typography>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <ActionButton
          label="Desvincular Dispositivo"
          onPress={async () => {
            await unpairDevice();
          }}
          loadingLabel="Desconectando módulo..."
          successLabel="Desvinculado!"
          icon={Unplug}
          variant="outline"
        />
        <Typography
          variant="caption"
          align="center"
          color={colors.text.muted}
          style={{ marginTop: 12 }}
        >
          Isso interromperá as leituras automatizadas desta planta.
        </Typography>
      </View>
    </View>
  );

  const renderScanStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.radarHeader}>
        <View style={styles.radarIconBox}>
          {isScanning ? (
            <ActivityIndicator size="large" color={colors.primary.main} />
          ) : (
            <Bluetooth size={32} color={colors.primary.main} />
          )}
        </View>
        <Typography variant="h2" style={{ marginTop: 16 }}>
          {isScanning ? "Buscando módulos..." : "Dispositivos próximos"}
        </Typography>
        <Typography
          variant="body"
          color={colors.text.secondary}
          align="center"
          style={{ marginTop: 8 }}
        >
          Ligue seu ESP32 e aproxime o celular. Selecione o dispositivo
          FloraSense na lista abaixo.
        </Typography>
      </View>

      <View style={styles.deviceList}>
        {devices.map((device) => {
          const isThisConnecting = isConnecting === device.id;
          const isFlora = device.name.includes("FloraSense");

          return (
            <TouchableOpacity
              key={device.id}
              activeOpacity={0.7}
              disabled={isConnecting !== null}
              onPress={() => connectToDevice(device)}
              style={[styles.deviceCard, isFlora && styles.deviceCardHighlight]}
            >
              <View
                style={[
                  styles.deviceIconBg,
                  isFlora && { backgroundColor: colors.primary.faded },
                ]}
              >
                <Cpu
                  size={24}
                  color={isFlora ? colors.primary.main : colors.text.muted}
                />
              </View>

              <View style={styles.deviceInfo}>
                <Typography
                  variant="body"
                  weight="bold"
                  color={isFlora ? colors.primary.main : colors.text.primary}
                >
                  {device.name}
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Sinal: {device.signal} dBm
                </Typography>
              </View>

              {isThisConnecting ? (
                <ActivityIndicator size="small" color={colors.primary.main} />
              ) : (
                <ChevronRightIcon />
              )}
            </TouchableOpacity>
          );
        })}

        {!isScanning && devices.length === 0 && (
          <View style={styles.emptyState}>
            <Typography variant="body" color={colors.text.muted}>
              Nenhum dispositivo encontrado.
            </Typography>
          </View>
        )}
      </View>

      {!isScanning && (
        <Button
          variant="outline"
          label="Buscar Novamente"
          icon={RefreshCw}
          onPress={scanDevices}
          style={{ marginTop: 24 }}
        />
      )}
    </View>
  );

  const renderWifiStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.connectedBadge}>
        <CheckCircle2 size={24} color={colors.success.main} />
        <View style={{ marginLeft: 12 }}>
          <Typography
            variant="caption"
            weight="bold"
            color={colors.success.main}
          >
            CONECTADO VIA BLUETOOTH
          </Typography>
          <Typography variant="body" color={colors.text.primary}>
            {connectedDevice}
          </Typography>
        </View>
      </View>

      <View style={styles.infoBox}>
        <SmartphoneNfc
          size={28}
          color={colors.info.main}
          style={{ marginBottom: 12 }}
        />
        <Typography variant="title" align="center">
          Conexão com a Internet
        </Typography>
        <Typography
          variant="body"
          color={colors.text.secondary}
          align="center"
          style={{ marginTop: 8 }}
        >
          Agora, forneça os dados da rede Wi-Fi onde o sensor ficará, para que
          ele possa enviar telemetria contínua para a Nuvem.
        </Typography>
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Nome da Rede Wi-Fi (SSID)"
          icon={Wifi}
          value={ssid}
          onChangeText={setSsid}
          placeholder="Ex: Minha_Rede_Casa"
        />
        <InputField
          label="Senha do Wi-Fi"
          icon={KeyRound}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
      </View>

      <ActionButton
        label="Transferir Credenciais"
        onPress={handlePair}
        loadingLabel="Gravando no ESP32..."
        successLabel="Sincronizado!"
        iconPosition="right"
        icon={Bluetooth}
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {error && (plant || step !== "scan") ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={clearMessages}
        />
      ) : null}
      {success ? (
        <AlertMessage
          title="Sucesso"
          message={success}
          type="success"
          onClose={clearMessages}
        />
      ) : null}

      {step === "connected" && renderConnectedStep()}
      {step === "scan" && renderScanStep()}
      {step === "wifi" && renderWifiStep()}
    </ScrollView>
  );
}

const ChevronRightIcon = () => (
  <View style={styles.chevronBox}>
    <Typography variant="caption" weight="bold" color={colors.text.muted}>
      Conectar
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingVertical: 24 },

  stepContainer: { flex: 1 },

  radarHeader: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  radarIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary.light,
  },

  deviceList: { gap: 12 },
  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deviceCardHighlight: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.faded + "40",
  },
  deviceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceHighlight,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceInfo: { flex: 1, marginLeft: 16 },
  chevronBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 8,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },

  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success.light,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.success.main,
  },
  infoBox: {
    backgroundColor: colors.info.light,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.info.main,
  },
  formContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },

  detailsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});
