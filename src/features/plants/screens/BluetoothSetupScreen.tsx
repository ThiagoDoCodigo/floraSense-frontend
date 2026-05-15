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

export default function BluetoothSetupScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { plantId } = route.params;

  const {
    step,
    isScanning,
    devices,
    connectedDevice,
    isConnecting,
    ssid,
    setSsid,
    password,
    setPassword,
    pairing,
    error,
    success,
    scanDevices,
    connectToDevice,
    pairDevice,
    clearMessages,
  } = useBluetoothSetupViewModel(plantId);

  const handlePair = async () => {
    await pairDevice();
    setTimeout(() => {
      if (navigation.canGoBack()) navigation.goBack();
    }, 2000);
  };

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
      {error ? (
        <AlertMessage
          title="Falha"
          message={error}
          type="error"
          onClose={clearMessages}
        />
      ) : null}
      {success ? (
        <AlertMessage
          title="Tudo Certo!"
          message={success}
          type="success"
          onClose={clearMessages}
        />
      ) : null}

      {step === "scan" ? renderScanStep() : renderWifiStep()}
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
  content: { paddingVertical: 40 },

  stepContainer: { flex: 1 },

  radarHeader: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 16,
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
});
