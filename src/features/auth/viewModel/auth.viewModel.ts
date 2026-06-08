import { useState, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../services/auth.service";
import NetInfo from "@react-native-community/netinfo";

interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  code?: string;
}

export const useAuthViewModel = () => {
  const { signIn, signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});

  const clearMessages = useCallback(() => {
    setGlobalError("");
    setGlobalSuccess("");
    setFieldErrors({});
  }, []);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const performLogin = async (): Promise<boolean> => {
    clearMessages();
    const errors: AuthFormErrors = {};

    if (!email.trim()) errors.email = "O e-mail é obrigatório.";
    else if (!isValidEmail(email)) errors.email = "Formato inválido.";
    if (!password) errors.password = "A senha é obrigatória.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw errors;
    }

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setGlobalError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    setIsProcessing(true);
    try {
      await signIn({ email: email.trim(), password });
      return true;
    } catch (err: any) {
      console.log("ERRO AXIOS:", err.message);
      setGlobalError(err.response?.data?.message || "Falha na autenticação.");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const performRegister = async (): Promise<boolean> => {
    clearMessages();
    const errors: AuthFormErrors = {};

    if (!name.trim() || name.length < 3)
      errors.name = "Insira seu nome completo.";

    if (!email.trim()) errors.email = "O e-mail é obrigatório.";
    else if (!isValidEmail(email)) errors.email = "Formato inválido.";

    if (!password || password.length < 6)
      errors.password = "Mínimo de 6 caracteres.";

    if (!confirmPassword) {
      errors.confirmPassword = "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw errors;
    }

    const netInfo = await NetInfo.fetch();

    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setGlobalError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    setIsProcessing(true);
    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      return true;
    } catch (err: any) {
      setGlobalError(err.response?.data?.message || "Falha ao criar conta.");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const performRecover = async (): Promise<boolean> => {
    clearMessages();
    const errors: AuthFormErrors = {};

    if (!email.trim() || !isValidEmail(email)) {
      setFieldErrors({ email: "Insira um e-mail válido para recuperação." });
      throw errors;
    }

    const netInfo = await NetInfo.fetch();
    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setGlobalError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    setIsProcessing(true);
    try {
      const res = await authService.recoverPassword(email.trim());
      setGlobalSuccess(res.message);
      return true;
    } catch (err: any) {
      setGlobalError(
        err.response?.data?.message ||
          err.message ||
          "Erro ao solicitar recuperação.",
      );
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const performResetPassword = async (): Promise<boolean> => {
    clearMessages();
    const errors: AuthFormErrors = {};

    if (!email.trim() || !isValidEmail(email))
      errors.email = "E-mail inválido.";
    if (!code.trim() || code.length !== 6)
      errors.code = "O código deve ter exatos 6 dígitos.";
    if (!password || password.length < 6)
      errors.password = "Mínimo de 6 caracteres.";
    if (!confirmPassword) {
      errors.confirmPassword = "Confirme sua nova senha.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw errors;
    }

    const netInfo = await NetInfo.fetch();
    if (
      netInfo.isConnected === false ||
      netInfo.isInternetReachable === false
    ) {
      setGlobalError(
        "Sem conexão com a internet. Verifique sua conexão e tente novamente.",
      );
      throw new Error("No Internet Connection");
    }

    setIsProcessing(true);
    try {
      const res = await authService.resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword: password,
      });
      setGlobalSuccess(res.message);
      return true;
    } catch (err: any) {
      setGlobalError(
        err.response?.data?.message ||
          "Falha ao redefinir a senha. O código pode ser inválido ou expirado.",
      );
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,
    isProcessing,
    globalError,
    globalSuccess,
    fieldErrors,
    performLogin,
    performRegister,
    performRecover,
    performResetPassword,
    clearMessages,
  };
};
