import { View, StyleSheet, ScrollView } from "react-native";
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

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const {
    viewModel,
    name,
    email,
    password,
    confirmPassword,
    error,
    fieldErrors,
  } = useAuthViewModel();

  const handleRegister = async () => {
    try {
      await viewModel.performRegister();
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "MainFlow" }] });
      }, 1000);
    } catch (e) {
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <AlertMessage
          title="Erro no Cadastro"
          message={error}
          type="error"
          onClose={() => viewModel.clearError()}
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
          onChangeText={(text) => viewModel.setName(text)}
          autoCapitalize="words"
          error={fieldErrors.name}
        />

        <InputField
          label="E-mail *"
          icon={Mail}
          placeholder="exemplo@flora.com"
          value={email}
          onChangeText={(text) => viewModel.setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
        />

        <InputField
          label="Senha *"
          icon={Lock}
          placeholder="Mínimo de 6 caracteres"
          value={password}
          onChangeText={(text) => viewModel.setPassword(text)}
          secureTextEntry
          error={fieldErrors.password}
        />

        <InputField
          label="Confirmar Senha *"
          icon={Lock}
          placeholder="Repita sua senha"
          value={confirmPassword}
          onChangeText={(text) => viewModel.setConfirmPassword(text)}
          secureTextEntry
          error={fieldErrors.confirmPassword}
        />
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label="Finalizar Cadastro"
          loadingLabel="Criando conta..."
          successLabel="Bem-vindo!"
          errorLabel="Erro ao criar conta"
          onPress={handleRegister}
          iconPosition="right"
        />

        <Button
          variant="outline"
          label="Voltar para o Login"
          onPress={() => navigation.goBack()}
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
