import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyRound, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Header,
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
  Button,
} from "react-native-th-components";
import { useAuthViewModel } from "../viewModel/auth.viewModel";

export default function RecoverScreen() {
  const navigation = useNavigation<any>();
  const {
    email,
    setEmail,
    globalError,
    globalSuccess,
    clearMessages,
    fieldErrors,
    performRecover,
    isProcessing,
  } = useAuthViewModel();

  const handleRecover = async () => {
    const success = await performRecover();
    if (success) {
      setTimeout(() => {
        navigation.goBack();
      }, 2500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {globalError ? (
        <AlertMessage
          title="Erro"
          message={globalError}
          type="error"
          onClose={clearMessages}
        />
      ) : null}

      {globalSuccess ? (
        <AlertMessage
          title="Tudo certo!"
          message={globalSuccess}
          type="success"
          onClose={clearMessages}
        />
      ) : null}

      <Header
        title="Recuperar Acesso"
        subtitle="Enviaremos instruções seguras para você"
        icon={KeyRound}
      />

      <View style={styles.infoBox}>
        <Typography variant="body" color={colors.text.secondary} align="center">
          Digite o e-mail cadastrado na sua conta. Se ele existir em nossa base,
          você receberá um link para redefinir sua senha.
        </Typography>
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="E-mail Cadastrado"
          icon={Mail}
          placeholder="exemplo@flora.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
          editable={!isProcessing}
        />
      </View>

      <View style={styles.footer}>
        <ActionButton
          label={isProcessing ? "Enviando e-mail..." : "Enviar Instruções"}
          onPress={handleRecover}
          iconPosition="right"
        />
        <Button
          variant="outline"
          label="Cancelar e voltar"
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBox: {
    backgroundColor: colors.surfaceHighlight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formContainer: { flex: 1 },
  footer: { paddingBottom: 32, gap: 16 },
});
