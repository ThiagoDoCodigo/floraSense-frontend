import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Lock, KeyRoundIcon } from "lucide-react-native";

import {
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
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    error,
    clearError,
    success,
    clearSuccess,
    fieldErrors,
    performChangePassword,
  } = useProfileViewModel();

  const handlePasswordChange = async () => {
    try {
      await performChangePassword();
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (e) {
      throw e;
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <AlertMessage
          title="Erro"
          message={error}
          type="error"
          onClose={clearError}
        />
      ) : null}

      {success ? (
        <AlertMessage
          title="Senha Atualizada"
          message={success}
          type="success"
          onClose={clearSuccess}
        />
      ) : null}

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
            nova. A nova senha não pode ser igual à atual e deve ter no mínimo 6
            caracteres.
          </Typography>
        </View>

        <InputField
          label="Senha Atual"
          icon={Lock}
          placeholder="Sua senha antiga"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          error={fieldErrors.currentPassword}
        />

        <View style={styles.divider} />

        <InputField
          label="Nova Senha"
          icon={Lock}
          placeholder="Mínimo de 6 caracteres"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          error={fieldErrors.newPassword}
        />

        <InputField
          label="Confirmar Nova Senha"
          icon={Lock}
          placeholder="Repita a nova senha"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
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
  container: { flex: 1, paddingTop: 16 },
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
