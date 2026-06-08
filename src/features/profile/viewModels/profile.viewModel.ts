import { useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profileService from "../services/profile.service";
import { useAuth } from "../../../contexts/AuthContext";
import {
  configureTheme,
  ThemeMode,
  ThemeFamily,
} from "react-native-th-components";
import NetInfo from "@react-native-community/netinfo";

export const useProfileViewModel = () => {
  const { user, updateUserProfile, signOut } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [urgentAlertsOnly, setUrgentAlertsOnly] = useState(false);
  const appVersion = "1.0.0";

  const [themePreference, setThemePreference] = useState<ThemeMode>("auto");
  const [themeFamily, setThemeFamily] = useState<ThemeFamily>("default");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  useEffect(() => {
    async function fetchPreferences() {
      const savedTheme = await AsyncStorage.getItem("@theme_preference");
      const savedFamily = await AsyncStorage.getItem("@theme_family");

      if (savedTheme) {
        setThemePreference(savedTheme as ThemeMode);
        Appearance.setColorScheme(
          savedTheme === "auto" ? null : (savedTheme as "light" | "dark"),
        );
      }

      if (savedFamily) {
        setThemeFamily(savedFamily as ThemeFamily);
      }
    }
    fetchPreferences();
  }, []);

  const changeTheme = async (pref: ThemeMode) => {
    setThemePreference(pref);
    Appearance.setColorScheme(pref === "auto" ? null : pref);
    await AsyncStorage.setItem("@theme_preference", pref);
    configureTheme({ themeName: pref, themeFamily });
  };

  const changeThemeFamily = async (family: ThemeFamily) => {
    setThemeFamily(family);
    await AsyncStorage.setItem("@theme_family", family);
    configureTheme({ themeName: themePreference, themeFamily: family });
  };

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const toggleUrgentAlertsOnly = () => setUrgentAlertsOnly((prev) => !prev);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const isValidEmail = (emailToCheck: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToCheck);
  };

  const performUpdateProfile = async (): Promise<void> => {
    clearMessages();
    const errors: { name?: string; email?: string } = {};

    if (!name || name.trim().length < 3)
      errors.name = "Insira seu nome completo (mín. 3 letras).";
    if (!email) errors.email = "O e-mail é obrigatório.";
    else if (!isValidEmail(email)) errors.email = "Formato de e-mail inválido.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw new Error("Verifique os campos destacados.");
    }

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    try {
      const updatedProfile = await profileService.updateProfile(
        name.trim(),
        email.trim(),
        avatarUrl,
      );
      if (updateUserProfile) {
        await updateUserProfile({
          name: updatedProfile.name,
          email: updatedProfile.email,
          avatarUrl: updatedProfile.avatarUrl,
        });
      }
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err: any) {
      const apiError =
        err?.response?.data?.message || "Erro ao atualizar perfil.";
      setError(apiError);
      throw new Error(apiError);
    }
  };

  const performChangePassword = async (): Promise<void> => {
    clearMessages();
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};

    if (!currentPassword) errors.currentPassword = "Digite sua senha atual.";
    if (!newPassword) errors.newPassword = "Digite uma nova senha.";
    else if (newPassword.length < 6)
      errors.newPassword = "A nova senha deve ter pelo menos 6 caracteres.";
    else if (newPassword === currentPassword)
      errors.newPassword = "A nova senha não pode ser igual à atual.";

    if (!confirmNewPassword)
      errors.confirmNewPassword = "Confirme sua nova senha.";
    else if (newPassword !== confirmNewPassword)
      errors.confirmNewPassword = "As senhas não coincidem.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw new Error("Verifique os campos destacados.");
    }

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    try {
      await profileService.changePassword(currentPassword, newPassword);
      setSuccess("Senha alterada com segurança!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      const apiError =
        err?.response?.data?.message || "Erro ao alterar a senha.";
      setError(apiError);
      throw new Error(apiError);
    }
  };

  return {
    user,
    name,
    setName: (n: string) => {
      setName(n);
      clearFieldError("name");
    },
    email,
    setEmail: (e: string) => {
      setEmail(e);
      clearFieldError("email");
    },
    avatarUrl,
    setAvatarUrl,
    currentPassword,
    setCurrentPassword: (p: string) => {
      setCurrentPassword(p);
      clearFieldError("currentPassword");
    },
    newPassword,
    setNewPassword: (p: string) => {
      setNewPassword(p);
      clearFieldError("newPassword");
    },
    confirmNewPassword,
    setConfirmNewPassword: (p: string) => {
      setConfirmNewPassword(p);
      clearFieldError("confirmNewPassword");
    },
    error,
    success,
    fieldErrors,
    clearError: () => setError(""),
    clearSuccess: () => setSuccess(""),
    clearMessages,
    performUpdateProfile,
    performChangePassword,
    logout: signOut,
    settings: {
      notificationsEnabled,
      urgentAlertsOnly,
      appVersion,
      themePreference,
      themeFamily,
    },
    toggleNotifications,
    toggleUrgentAlertsOnly,
    changeTheme,
    changeThemeFamily,
  };
};
