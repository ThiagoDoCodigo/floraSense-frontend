import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyRound, Lock, ArrowLeft, KeyRoundIcon } from "lucide-react-native";

import {
  Header,
  InputField,
  ActionButton,
  Button,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useProfileViewModel } from "../viewModels/profile.viewModel";

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();
  const {
    viewModel,
    currentPassword,
    newPassword,
    confirmNewPassword,
    error,
    success,
    fieldErrors,
  } = useProfileViewModel();

  const handlePasswordChange = async () => {
    try {
      await viewModel.performChangePassword();
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (e) {
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <AlertMessage
          title="Erro"
          message={error}
          type="error"
          onClose={() => viewModel.clearError()}
        />
      ) : null}

      {success ? (
        <AlertMessage
          title="Senha Atualizada"
          message={success}
          type="success"
          onClose={() => viewModel.clearSuccess()}
        />
      ) : null}

      <Header
        title="Alterar Senha"
        subtitle="Crie uma nova senha segura"
        icon={KeyRound}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoBox}>
          <Typography
            variant="body"
            color={colors.text.secondary}
            align="center"
          >
            Para sua segurança, informe sua senha atual antes de definir uma
            nova. A nova senha deve ter no mínimo 6 caracteres.
          </Typography>
        </View>

        <InputField
          label="Senha Atual"
          icon={Lock}
          placeholder="Sua senha antiga"
          value={currentPassword}
          onChangeText={(text) => viewModel.setCurrentPassword(text)}
          secureTextEntry
          error={fieldErrors.currentPassword}
        />

        <View style={styles.divider} />

        <InputField
          label="Nova Senha"
          icon={Lock}
          placeholder="Mínimo de 6 caracteres"
          value={newPassword}
          onChangeText={(text) => viewModel.setNewPassword(text)}
          secureTextEntry
          error={fieldErrors.newPassword}
        />

        <InputField
          label="Confirmar Nova Senha"
          icon={Lock}
          placeholder="Repita a nova senha"
          value={confirmNewPassword}
          onChangeText={(text) => viewModel.setConfirmNewPassword(text)}
          secureTextEntry
          error={fieldErrors.confirmNewPassword}
        />
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label="Atualizar Senha"
          loadingLabel="Validando..."
          successLabel="Senha Alterada!"
          onPress={handlePasswordChange}
          iconPosition="right"
          icon={KeyRoundIcon}
        />
        <Button
          variant="outline"
          label="Cancelar e voltar"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  infoBox: {
    backgroundColor: colors.surfaceHighlight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
    marginBottom: 24,
  },
  footer: {
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
  },
});
