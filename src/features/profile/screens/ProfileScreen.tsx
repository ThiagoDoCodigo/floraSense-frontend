import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  Mail,
  Camera,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Save,
} from "lucide-react-native";

import {
  Header,
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
} from "react-native-th-components";
import { useProfileViewModel } from "../viewModels/profile.viewModel";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { viewModel, name, email, avatarUrl, error, success, fieldErrors } =
    useProfileViewModel();

  const handleUpdate = async () => {
    try {
      await viewModel.performUpdateProfile();
    } catch (e) {
      throw error;
    }
  };

  const handleChangePhoto = () => {
    console.log("Abrir galeria de imagens");
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "AuthFlow" }] });
  };

  return (
    <View style={styles.container}>
      {error ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={() => viewModel.clearError()}
        />
      ) : null}

      {success ? (
        <AlertMessage
          title="Sucesso!"
          message={success}
          type="success"
          onClose={() => viewModel.clearSuccess()}
        />
      ) : null}

      <Header
        title="Meu Perfil"
        subtitle="Gerencie sua conta e segurança"
        icon={User}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleChangePhoto}
            style={styles.avatarWrapper}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Typography variant="h1" color={colors.primary.main}>
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </Typography>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Camera size={16} color={colors.text.inverse} />
            </View>
          </TouchableOpacity>

          <Typography
            variant="h2"
            color={colors.text.primary}
            style={{ marginTop: 16 }}
          >
            {name || "Seu Nome"}
          </Typography>
          <Typography variant="body" color={colors.text.secondary}>
            {email || "seuemail@exemplo.com"}
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.muted}
            style={styles.sectionTitle}
          >
            DADOS PESSOAIS
          </Typography>

          <View style={styles.card}>
            <InputField
              label="Nome Completo"
              icon={User}
              value={name}
              onChangeText={(text) => viewModel.setName(text)}
              autoCapitalize="words"
              error={fieldErrors.name}
            />
            <InputField
              label="E-mail de Acesso"
              icon={Mail}
              value={email}
              onChangeText={(text) => viewModel.setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={fieldErrors.email}
            />
            <View style={styles.buttonWrapper}>
              <ActionButton
                label="Salvar Alterações"
                onPress={handleUpdate}
                loadingLabel="Salvando..."
                successLabel="Salvo!"
                iconPosition="right"
                icon={Save}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.muted}
            style={styles.sectionTitle}
          >
            SEGURANÇA E CONTA
          </Typography>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: colors.info.light },
                ]}
              >
                <ShieldCheck size={20} color={colors.info.main} />
              </View>
              <Typography
                style={styles.menuText}
                weight="semibold"
                color={colors.text.primary}
              >
                Segurança e Senha
              </Typography>
              <ChevronRight size={18} color={colors.text.muted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={handleLogout}
            >
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: colors.danger.faded },
                ]}
              >
                <LogOut size={20} color={colors.danger.main} />
              </View>
              <Typography
                style={styles.menuText}
                weight="semibold"
                color={colors.danger.main}
              >
                Encerrar Sessão
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },

  avatarSection: { alignItems: "center", marginTop: 16, marginBottom: 32 },
  avatarWrapper: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  avatarPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
  },

  section: { marginBottom: 28 },
  sectionTitle: { marginBottom: 12, marginLeft: 8, letterSpacing: 0.5 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  buttonWrapper: { marginTop: 8 },

  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: { flex: 1, fontSize: 15 },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceHighlight,
    marginVertical: 12,
    marginLeft: 54,
  },
});
