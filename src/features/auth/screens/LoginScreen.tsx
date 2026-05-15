import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Lock, LogIn, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Header,
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useAuthViewModel } from "../viewModel/auth.viewModel";

const imageFlora = require("../../../../assets/florasense.png");

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { viewModel, email, password, error, fieldErrors } = useAuthViewModel();

  const handleLogin = async () => {
    try {
      await viewModel.performLogin();
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
          title="Erro de Autenticação"
          message={error}
          type="error"
          onClose={() => viewModel.clearError()}
        />
      ) : null}

      <Image source={imageFlora} style={styles.image} resizeMode="cover" />

      <Header
        title="Entrar na Plataforma"
        subtitle="Identifique-se para acessar o sistema"
        icon={LogIn}
      />

      <View style={styles.formContainer}>
        <InputField
          label="E-mail de acesso"
          icon={Mail}
          placeholder="exemplo@flora.com"
          value={email}
          onChangeText={(text) => viewModel.setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
        />

        <InputField
          label="Senha"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChangeText={(text) => viewModel.setPassword(text)}
          secureTextEntry
          error={fieldErrors.password}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Recover")}
          style={styles.forgotPassword}
        >
          <Typography
            variant="caption"
            weight="bold"
            color={colors.primary.main}
          >
            Esqueceu sua senha?
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ActionButton
          label="Entrar na Plataforma"
          onPress={handleLogin}
          iconPosition="right"
          errorLabel="Erro ao efetuar login"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.registerLink}
        >
          <Typography variant="body" align="center">
            Não possui conta?{" "}
            <Typography weight="bold" color={colors.primary.main}>
              Cadastre-se
            </Typography>
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { flex: 1, marginTop: 20 },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 24,
    paddingVertical: 8,
  },
  footer: { paddingBottom: 32, gap: 16 },
  registerLink: { paddingVertical: 12 },
  image: { width: 180, height: 180, alignSelf: "center" },
});
