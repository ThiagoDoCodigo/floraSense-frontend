import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
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
  Settings,
} from "lucide-react-native";
import {
  InputField,
  ActionButton,
  Typography,
  Button,
  colors,
  AlertMessage,
  ConfirmationModal,
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
    setStep,
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
    loadData,
    scanDevices,
    connectToDevice,
    pairDevice,
    unpairDevice,
    clearMessages,
    rationaleModalVisible,
    blockedModalVisible,
    rationaleMessage,
    blockedMessage,
    handleRationaleConfirm,
    handleRationaleCancel,
    handleBlockedConfirm,
    handleBlockedCancel,
  } = useBluetoothSetupViewModel(plantId);

  const handlePair = async () => {
    try {
      const ok = await pairDevice();
      if (ok)
        setTimeout(() => {
          if (navigation.canGoBack()) navigation.goBack();
        }, 3000);
    } catch (e) {
      throw e;
    }
  };

  if (step === "loading") {
    return (
      <LoadingIndicator
        message="Validando Hardware..."
        subMessage="Checando conexão na nuvem"
        fullScreen={true}
      />
    );
  }

  if (
    step === "error" ||
    (error &&
      !plant &&
      step !== "connected" &&
      step !== "wifi" &&
      step !== "permission_blocked")
  ) {
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
          Módulo FloraSense pareado e comunicando via Wi-Fi.
        </Typography>
      </View>

      <View style={styles.detailsContainer}>
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
      </View>

      <View style={{ marginTop: 32 }}>
        <ActionButton
          label="Desvincular Dispositivo"
          onPress={async () => {
            await unpairDevice();
          }}
          loadingLabel="Enviando comando de reset..."
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
          Isso limpa a memória do ESP32 e interrompe as leituras automáticas.
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
          {isScanning ? "Buscando FloraSense..." : "Módulos Próximos"}
        </Typography>
      </View>

      <View style={styles.deviceList}>
        {devices.map((device) => {
          const isThisConnecting = isConnecting === device.id;
          return (
            <TouchableOpacity
              key={device.id}
              activeOpacity={0.7}
              disabled={isConnecting !== null}
              onPress={() => connectToDevice(device)}
              style={styles.deviceCardHighlight}
            >
              <View
                style={[
                  styles.deviceIconBg,
                  { backgroundColor: colors.primary.faded },
                ]}
              >
                <Cpu size={24} color={colors.primary.main} />
              </View>
              <View style={styles.deviceInfo}>
                <Typography
                  variant="body"
                  weight="bold"
                  color={colors.primary.main}
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
                <View style={styles.chevronBox}>
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={colors.primary.main}
                  >
                    Parear
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        {!isScanning && devices.length === 0 && (
          <View style={styles.emptyState}>
            <Typography variant="body" color={colors.text.muted}>
              Nenhum módulo em modo BLE encontrado.
            </Typography>
          </View>
        )}
      </View>
      {!isScanning && (
        <Button
          variant="outline"
          label="Escanear Novamente"
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
          Forneça os dados da sua rede Wi-Fi (2.4GHz) para que o ESP32 possa
          enviar a telemetria para a Nuvem.
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
        loadingLabel="Gravando na Flash do ESP32..."
        successLabel="Sincronizado!"
        iconPosition="right"
        icon={Bluetooth}
      />
    </View>
  );

  const renderPermissionBlockedStep = () => (
    <View style={styles.stepContainer}>
      <View
        style={[
          styles.infoBox,
          {
            borderColor: colors.danger.main,
            backgroundColor: colors.danger.faded,
          },
        ]}
      >
        <Bluetooth
          size={48}
          color={colors.danger.main}
          style={{ marginBottom: 16 }}
        />
        <Typography variant="h2" align="center" color={colors.danger.main}>
          Acesso Bloqueado
        </Typography>
        <Typography
          variant="body"
          color={colors.text.secondary}
          align="center"
          style={{ marginTop: 8 }}
        >
          As permissões foram negadas permanentemente no seu dispositivo e o
          Android bloqueou novas solicitações.
          {"\n\n"}
          Abra as Configurações do seu aparelho, vá em "Permissões" e ative o
          acesso a "Dispositivos Próximos" (ou Localização).
        </Typography>
      </View>
      <View style={{ marginTop: 16 }}>
        <ActionButton
          label="Abrir Configurações do App"
          onPress={() => Linking.openSettings()}
          icon={Settings}
        />
        <Button
          variant="outline"
          label="Já permiti, escanear novamente"
          icon={RefreshCw}
          onPress={() => {
            setStep("scan");
            scanDevices();
          }}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error &&
        (plant || step !== "scan") &&
        step !== "permission_blocked" ? (
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
        {step === "permission_blocked" && renderPermissionBlockedStep()}
      </ScrollView>

      <ConfirmationModal
        isOpen={rationaleModalVisible}
        onClose={handleRationaleCancel}
        onConfirm={handleRationaleConfirm}
        title="Permissão Necessária"
        message={rationaleMessage}
      />

      <ConfirmationModal
        isOpen={blockedModalVisible}
        onClose={handleBlockedCancel}
        onConfirm={handleBlockedConfirm}
        title="Acesso Bloqueado"
        message={blockedMessage}
        confirmText="Configurações"
        isDestructive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingVertical: 16 },
  stepContainer: { flex: 1 },
  radarHeader: { alignItems: "center", marginBottom: 32, paddingTop: 16 },
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
  deviceCardHighlight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary.faded + "40",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  deviceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceInfo: { flex: 1, marginLeft: 16 },
  chevronBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
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
