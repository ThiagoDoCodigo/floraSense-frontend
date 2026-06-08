import {
  View,
  StyleSheet,
  ScrollView,
  InteractionManager,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Lock, Mail, Hash, ShieldCheck } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

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
import { LoadingIndicator } from "../../../components/LoadingIndicator";

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    globalError,
    globalSuccess,
    clearMessages,
    fieldErrors,
    performResetPassword,
    isProcessing,
  } = useAuthViewModel();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (route.params?.defaultEmail) {
      setEmail(route.params.defaultEmail);
    }
  }, [route.params]);

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

  if (!isReady) {
    return (
      <LoadingIndicator
        message="Carregando..."
        subMessage="Aguarde um momento"
        fullScreen={true}
      />
    );
  }

  const handleReset = async () => {
    const success = await performResetPassword();
    if (success) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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
            title="Senha Redefinida!"
            message={globalSuccess}
            type="success"
            onClose={clearMessages}
          />
        ) : null}

        <Header
          title="Nova Senha"
          subtitle="Insira o código de 6 dígitos enviado ao seu e-mail"
          icon={ShieldCheck}
        />

        <View style={styles.formContainer}>
          <InputField
            label="E-mail"
            icon={Mail}
            placeholder="Seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={fieldErrors.email}
            editable={!isProcessing}
          />

          <InputField
            label="Código de Segurança (6 dígitos)"
            icon={Hash}
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            error={fieldErrors.code}
            editable={!isProcessing}
          />

          <InputField
            label="Nova Senha"
            icon={Lock}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={fieldErrors.password}
            editable={!isProcessing}
          />

          <InputField
            label="Confirme a Nova Senha"
            icon={Lock}
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={fieldErrors.confirmPassword}
            editable={!isProcessing}
          />
        </View>

        <View style={styles.footer}>
          <ActionButton
            label={isProcessing ? "Validando e Salvando..." : "Redefinir Senha"}
            onPress={handleReset}
            iconPosition="right"
          />
          <Button
            variant="outline"
            label="Voltar para o Início"
            onPress={() => navigation.navigate("Login")}
            disabled={isProcessing}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, marginTop: 10 },
  formContainer: { flex: 1, gap: 4 },
  footer: { paddingBottom: 32, paddingTop: 16, gap: 16 },
});
