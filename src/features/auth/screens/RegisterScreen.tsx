import {
  View,
  StyleSheet,
  ScrollView,
  InteractionManager,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserPlus, User, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Header,
  InputField,
  ActionButton,
  colors,
  AlertMessage,
  Button,
} from "react-native-th-components";
import { useAuthViewModel } from "../viewModel/auth.viewModel";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "../../../components/LoadingIndicator";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    globalError,
    fieldErrors,
    clearMessages,
    performRegister,
    isProcessing,
  } = useAuthViewModel();

  const [isReady, setIsReady] = useState(false);

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

  const handleRegister = async () => {
    try {
      await performRegister();
    } catch (err) {
      throw err;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {globalError ? (
        <AlertMessage
          title="Erro no Cadastro"
          message={globalError}
          type="error"
          onClose={clearMessages}
        />
      ) : null}

      <Header
        title="Criar Conta"
        subtitle="Junte-se ao floraSense"
        icon={UserPlus}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <InputField
          label="Nome Completo *"
          icon={User}
          placeholder="Ex: João da Silva"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          error={fieldErrors.name}
          editable={!isProcessing}
        />

        <InputField
          label="E-mail *"
          icon={Mail}
          placeholder="exemplo@flora.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
          editable={!isProcessing}
        />

        <InputField
          label="Senha *"
          icon={Lock}
          placeholder="Mínimo de 6 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={fieldErrors.password}
          editable={!isProcessing}
        />

        <InputField
          label="Confirmar Senha *"
          icon={Lock}
          placeholder="Repita sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={fieldErrors.confirmPassword}
          editable={!isProcessing}
        />
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label={isProcessing ? "Criando conta..." : "Finalizar Cadastro"}
          onPress={handleRegister}
          iconPosition="right"
          errorLabel="Erro ao criar conta"
        />

        <Button
          variant="outline"
          label="Voltar para o Login"
          onPress={() => navigation.goBack()}
          disabled={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, marginTop: 10 },
  scrollContent: { paddingBottom: 20 },
  footer: { paddingBottom: 32, gap: 16, paddingTop: 10 },
});
