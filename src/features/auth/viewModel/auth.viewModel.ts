import { useState, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import authService from '../services/auth.service';

interface AuthFormErrors {
  email?: string;
  password?: string;
  name?: string;
}

export const useAuthViewModel = () => {
  const { signIn, signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});

  const clearMessages = useCallback(() => {
    setGlobalError('');
    setGlobalSuccess('');
    setFieldErrors({});
  }, []);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const performLogin = async (): Promise<boolean> => {
    clearMessages();
    const errors: AuthFormErrors = {};

    if (!email.trim()) errors.email = 'O e-mail é obrigatório.';
    else if (!isValidEmail(email)) errors.email = 'Formato inválido.';
    if (!password) errors.password = 'A senha é obrigatória.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    setIsProcessing(true);
    try {
      await signIn({ email: email.trim(), password });
      return true;
    } catch (err: any) {
      console.log("ERRO AXIOS:", err.message);
      setGlobalError(err.response?.data?.message || 'Falha na autenticação.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const performRegister = async (): Promise<boolean> => {
    clearMessages();
    const errors: AuthFormErrors = {};

    if (!name.trim() || name.length < 3) errors.name = 'Insira seu nome completo.';
    if (!email.trim()) errors.email = 'O e-mail é obrigatório.';
    else if (!isValidEmail(email)) errors.email = 'Formato inválido.';
    if (!password || password.length < 6) errors.password = 'Mínimo de 6 caracteres.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    setIsProcessing(true);
    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      return true;
    } catch (err: any) {
      setGlobalError(err.response?.data?.message || 'Falha ao criar conta.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const performRecover = async (): Promise<boolean> => {
    clearMessages();
    if (!email.trim() || !isValidEmail(email)) {
      setFieldErrors({ email: 'Insira um e-mail válido para recuperação.' });
      return false;
    }

    setIsProcessing(true);
    try {
      const res = await authService.recoverPassword(email.trim());
      setGlobalSuccess(res.message);
      return true;
    } catch (err: any) {
      setGlobalError(err.message || 'Erro ao solicitar recuperação.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    isProcessing, globalError, globalSuccess, fieldErrors,
    performLogin, performRegister, performRecover, clearMessages
  };
};