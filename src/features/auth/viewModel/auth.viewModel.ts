import { useState, useEffect } from 'react';
import authService from '../services/auth.service';

export class AuthViewModel {
  private _name = '';
  private _email = '';
  private _password = '';
  private _confirmPassword = '';
  
  private _error = '';
  private _success = '';
  private _fieldErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

  private setNameCallback: ((n: string) => void) | null = null;
  private setEmailCallback: ((e: string) => void) | null = null;
  private setPasswordCallback: ((p: string) => void) | null = null;
  private setConfirmPasswordCallback: ((cp: string) => void) | null = null;
  
  private setErrorCallback: ((err: string) => void) | null = null;
  private setSuccessCallback: ((msg: string) => void) | null = null;
  private setFieldErrorsCallback: ((errors: any) => void) | null = null;

  get name() { return this._name; }
  get email() { return this._email; }
  get password() { return this._password; }
  get confirmPassword() { return this._confirmPassword; }
  get error() { return this._error; }
  get success() { return this._success; }
  get fieldErrors() { return this._fieldErrors; }

  setNameListener(cb: any) { this.setNameCallback = cb; }
  setEmailListener(cb: any) { this.setEmailCallback = cb; }
  setPasswordListener(cb: any) { this.setPasswordCallback = cb; }
  setConfirmPasswordListener(cb: any) { this.setConfirmPasswordCallback = cb; }
  setErrorListener(cb: any) { this.setErrorCallback = cb; }
  setSuccessListener(cb: any) { this.setSuccessCallback = cb; }
  setFieldErrorsListener(cb: any) { this.setFieldErrorsCallback = cb; }

  setName(n: string) {
    this._name = n;
    this.setNameCallback?.(n);
    if (this._fieldErrors.name) {
      this._fieldErrors = { ...this._fieldErrors, name: undefined };
      this.setFieldErrorsCallback?.(this._fieldErrors);
    }
  }

  setEmail(e: string) {
    this._email = e;
    this.setEmailCallback?.(e);
    if (this._fieldErrors.email) {
      this._fieldErrors = { ...this._fieldErrors, email: undefined };
      this.setFieldErrorsCallback?.(this._fieldErrors);
    }
  }

  setPassword(p: string) {
    this._password = p;
    this.setPasswordCallback?.(p);
    if (this._fieldErrors.password) {
      this._fieldErrors = { ...this._fieldErrors, password: undefined };
      this.setFieldErrorsCallback?.(this._fieldErrors);
    }
  }

  setConfirmPassword(cp: string) {
    this._confirmPassword = cp;
    this.setConfirmPasswordCallback?.(cp);
    if (this._fieldErrors.confirmPassword) {
      this._fieldErrors = { ...this._fieldErrors, confirmPassword: undefined };
      this.setFieldErrorsCallback?.(this._fieldErrors);
    }
  }

  clearMessages() {
    this._error = '';
    this._success = '';
    this._fieldErrors = {};
    this.setErrorCallback?.('');
    this.setSuccessCallback?.('');
    this.setFieldErrorsCallback?.({});
  }

  clearError() {
    this._error = '';
    this.setErrorCallback?.('');
  }

  clearSuccess() {
    this._success = '';
    this.setSuccessCallback?.('');
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async performLogin(): Promise<void> {
    this.clearMessages();
    const errors: { email?: string; password?: string } = {};

    if (!this._email) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!this.isValidEmail(this._email)) {
      errors.email = "Formato de e-mail inválido.";
    }

    if (!this._password) {
      errors.password = "A senha é obrigatória.";
    }

    if (Object.keys(errors).length > 0) {
      this._fieldErrors = errors;
      this.setFieldErrorsCallback?.(errors);
      throw new Error("Verifique os campos destacados."); 
    }

    try {
      await authService.login(this._email, this._password);
    } catch (err: any) {
      this._error = err.message || "Falha na autenticação.";
      this.setErrorCallback?.(this._error);
      throw err;
    }
  }

  async performRecover(): Promise<void> {
    this.clearMessages();
    const errors: { email?: string } = {};

    if (!this._email) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!this.isValidEmail(this._email)) {
      errors.email = "Formato de e-mail inválido.";
    }

    if (Object.keys(errors).length > 0) {
      this._fieldErrors = errors;
      this.setFieldErrorsCallback?.(errors);
      throw new Error("Verifique os campos destacados.");
    }
    
    try {
      const res = await authService.recoverPassword(this._email);
      this._success = res.message || "Link enviado com sucesso!";
      this.setSuccessCallback?.(this._success);
    } catch (err: any) {
      this._error = err.message || "Erro ao solicitar recuperação.";
      this.setErrorCallback?.(this._error);
      throw err;
    }
  }

  async performRegister(): Promise<void> {
    this.clearMessages();
    const errors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!this._name || this._name.trim().length < 3) {
      errors.name = "Insira seu nome completo.";
    }

    if (!this._email) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!this.isValidEmail(this._email)) {
      errors.email = "Formato de e-mail inválido.";
    }

    if (!this._password) {
      errors.password = "A senha é obrigatória.";
    } else if (this._password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!this._confirmPassword) {
      errors.confirmPassword = "Confirme sua senha.";
    } else if (this._password !== this._confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    if (Object.keys(errors).length > 0) {
      this._fieldErrors = errors;
      this.setFieldErrorsCallback?.(errors);
      throw new Error("Verifique os campos destacados.");
    }

    try {
      await authService.register(this._name, this._email, this._password);
    } catch (err: any) {
      this._error = err.message || "Falha ao registrar conta.";
      this.setErrorCallback?.(this._error);
      throw err;
    }
  }
}

export const useAuthViewModel = () => {
  const [viewModel] = useState(() => new AuthViewModel());
  const [name, setName] = useState(viewModel.name);
  const [email, setEmail] = useState(viewModel.email);
  const [password, setPassword] = useState(viewModel.password);
  const [confirmPassword, setConfirmPassword] = useState(viewModel.confirmPassword);
  
  const [error, setError] = useState(viewModel.error);
  const [success, setSuccess] = useState(viewModel.success);
  const [fieldErrors, setFieldErrors] = useState(viewModel.fieldErrors);

  useEffect(() => {
    viewModel.setNameListener(setName);
    viewModel.setEmailListener(setEmail);
    viewModel.setPasswordListener(setPassword);
    viewModel.setConfirmPasswordListener(setConfirmPassword);
    
    viewModel.setErrorListener(setError);
    viewModel.setSuccessListener(setSuccess);
    viewModel.setFieldErrorsListener(setFieldErrors);
  }, [viewModel]);

  return { viewModel, name, email, password, confirmPassword, error, success, fieldErrors };
};