import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
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
  Bell,
  AlertTriangle,
  Info,
  Leaf,
  Sun,
  Moon,
  MonitorSmartphone,
  Palette,
} from "lucide-react-native";

import {
  InputField,
  ActionButton,
  Typography,
  colors,
  AlertMessage,
  ConfirmationModal,
} from "react-native-th-components";
import { useProfileViewModel } from "../viewModels/profile.viewModel";
import { useState } from "react";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const {
    user,
    name,
    setName,
    email,
    setEmail,
    avatarUrl,
    error,
    clearError,
    success,
    clearSuccess,
    fieldErrors,
    performUpdateProfile,
    logout,
    settings,
    toggleNotifications,
    toggleUrgentAlertsOnly,
    changeTheme,
    changeThemeFamily,
  } = useProfileViewModel();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUpdate = async () => {
    try {
      await performUpdateProfile();
    } catch (e) {
      throw e;
    }
  };

  const handleChangePhoto = () => {
    console.log("Abrir galeria de imagens");
  };

  const handleLogout = async () => {
    try {
      setIsModalVisible(false);
      if (logout) {
        await logout();
      }
      navigation.reset({ index: 0, routes: [{ name: "AuthFlow" }] });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {error ? (
        <AlertMessage
          title="Atenção"
          message={error}
          type="error"
          onClose={clearError}
        />
      ) : null}

      {success ? (
        <AlertMessage
          title="Sucesso!"
          message={success}
          type="success"
          onClose={clearSuccess}
        />
      ) : null}

      <ConfirmationModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleLogout}
        title="Deseja realmente sair?"
        message="Voce deseja realmente sair da sua conta?"
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
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
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
            {user?.name || "Seu Nome"}
          </Typography>
          <Typography variant="body" color={colors.text.secondary}>
            {user?.email || "seuemail@exemplo.com"}
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

          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <InputField
              label="Nome Completo"
              icon={User}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={fieldErrors.name}
            />
            <InputField
              label="E-mail de Acesso"
              icon={Mail}
              value={email}
              onChangeText={setEmail}
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
            PERSONALIZAÇÃO
          </Typography>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.primary.faded },
                ]}
              >
                <Bell size={20} color={colors.primary.main} />
              </View>
              <View style={styles.settingTexts}>
                <Typography
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}
                >
                  Notificações
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Receber alertas das suas plantas
                </Typography>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: colors.border,
                  true: colors.primary.light,
                }}
                thumbColor={
                  settings.notificationsEnabled
                    ? colors.primary.main
                    : colors.text.muted
                }
              />
            </View>

            <View style={styles.divider} />

            {/* {<View style={styles.settingRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.warning.faded },
                ]}
              >
                <AlertTriangle size={20} color={colors.warning.main} />
              </View>
              <View style={styles.settingTexts}>
                <Typography
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}
                >
                  Somente Urgentes
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Notificar apenas alertas críticos
                </Typography>
              </View>
              <Switch
                value={settings.urgentAlertsOnly}
                onValueChange={toggleUrgentAlertsOnly}
                disabled={!settings.notificationsEnabled}
                trackColor={{
                  false: colors.border,
                  true: colors.warning.faded,
                }}
                thumbColor={
                  settings.urgentAlertsOnly
                    ? colors.warning.main
                    : colors.text.muted
                }
              />
            </View>} */}

            <View style={styles.settingRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.primary.faded },
                ]}
              >
                <Moon size={20} color={colors.info.main} />
              </View>
              <View style={styles.settingTexts}>
                <Typography
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}
                >
                  Modo de Exibição
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Escolha o modo claro ou escuro
                </Typography>
              </View>
            </View>

            <View
              style={[
                styles.themeSelector,
                { backgroundColor: colors.surfaceHighlight },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => changeTheme("light")}
                style={[
                  styles.themeOption,
                  settings.themePreference === "light" && [
                    styles.themeOptionActive,
                    { backgroundColor: colors.surface },
                  ],
                ]}
              >
                <Sun
                  size={18}
                  color={
                    settings.themePreference === "light"
                      ? colors.primary.main
                      : colors.text.muted
                  }
                />
                <Typography
                  variant="caption"
                  weight={
                    settings.themePreference === "light" ? "bold" : "medium"
                  }
                  color={
                    settings.themePreference === "light"
                      ? colors.primary.main
                      : colors.text.muted
                  }
                  style={{ marginLeft: 6 }}
                >
                  Claro
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => changeTheme("dark")}
                style={[
                  styles.themeOption,
                  settings.themePreference === "dark" && [
                    styles.themeOptionActive,
                    { backgroundColor: colors.surface },
                  ],
                ]}
              >
                <Moon
                  size={18}
                  color={
                    settings.themePreference === "dark"
                      ? colors.primary.main
                      : colors.text.muted
                  }
                />
                <Typography
                  variant="caption"
                  weight={
                    settings.themePreference === "dark" ? "bold" : "medium"
                  }
                  color={
                    settings.themePreference === "dark"
                      ? colors.primary.main
                      : colors.text.muted
                  }
                  style={{ marginLeft: 6 }}
                >
                  Escuro
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => changeTheme("auto")}
                style={[
                  styles.themeOption,
                  settings.themePreference === "auto" && [
                    styles.themeOptionActive,
                    { backgroundColor: colors.surface },
                  ],
                ]}
              >
                <MonitorSmartphone
                  size={18}
                  color={
                    settings.themePreference === "auto"
                      ? colors.primary.main
                      : colors.text.muted
                  }
                />
                <Typography
                  variant="caption"
                  weight={
                    settings.themePreference === "auto" ? "bold" : "medium"
                  }
                  color={
                    settings.themePreference === "auto"
                      ? colors.primary.main
                      : colors.text.muted
                  }
                  style={{ marginLeft: 6 }}
                >
                  Auto
                </Typography>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 16 }}>
              <View style={styles.settingRow}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: colors.primary.faded },
                  ]}
                >
                  <Palette size={20} color={colors.primary.main} />
                </View>
                <View style={styles.settingTexts}>
                  <Typography
                    variant="body"
                    weight="semibold"
                    color={colors.text.primary}
                  >
                    Cor Principal
                  </Typography>
                  <Typography variant="caption" color={colors.text.secondary}>
                    Escolha o sotaque do app
                  </Typography>
                </View>
              </View>

              <View
                style={[
                  styles.themeSelector,
                  { backgroundColor: colors.surfaceHighlight },
                ]}
              >
                {(["default", "blue", "violet"] as const).map((family) => (
                  <TouchableOpacity
                    key={family}
                    activeOpacity={0.7}
                    onPress={() => changeThemeFamily(family)}
                    style={[
                      styles.themeOption,
                      settings.themeFamily === family && [
                        styles.themeOptionActive,
                        { backgroundColor: colors.surface },
                      ],
                    ]}
                  >
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor:
                          family === "default"
                            ? "#748653"
                            : family === "blue"
                              ? "#0ea5e9"
                              : "#9333ea",
                      }}
                    />
                    <Typography
                      variant="caption"
                      weight={
                        settings.themeFamily === family ? "bold" : "medium"
                      }
                      color={
                        settings.themeFamily === family
                          ? colors.primary.main
                          : colors.text.muted
                      }
                      style={{ marginLeft: 6 }}
                    >
                      {family === "default"
                        ? "Natureza"
                        : family === "blue"
                          ? "Azul"
                          : "Violeta"}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
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

          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: colors.primary.faded },
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
              onPress={() => setIsModalVisible(true)}
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

        <View style={styles.section}>
          <Typography
            variant="caption"
            weight="bold"
            color={colors.text.muted}
            style={styles.sectionTitle}
          >
            SOBRE O APP
          </Typography>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.success.light },
                ]}
              >
                <Leaf size={20} color={colors.success.main} />
              </View>
              <View style={styles.settingTexts}>
                <Typography
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}
                >
                  FloraSense
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Versão {settings.appVersion}
                </Typography>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.surfaceHighlight },
                ]}
              >
                <Info size={20} color={colors.text.secondary} />
              </View>
              <View style={styles.settingTexts}>
                <Typography
                  variant="body"
                  weight="semibold"
                  color={colors.text.primary}
                >
                  Sobre
                </Typography>
                <Typography variant="caption" color={colors.text.secondary}>
                  Monitoramento inteligente de plantas via IoT e IA
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingTexts: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    marginLeft: 54,
  },
  themeSelector: {
    flexDirection: "row",
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  themeOptionActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
