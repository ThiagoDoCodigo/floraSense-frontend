import { useState, useEffect } from "react";
import profileService from "../services/profile.service";
import type { UserProfile } from "../models/profile.model";

export class ProfileViewModel {
  private _name = "";
  private _email = "";
  private _avatarUrl = "";

  private _currentPassword = "";
  private _newPassword = "";
  private _confirmNewPassword = "";

  private _error = "";
  private _success = "";
  private _fieldErrors: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  } = {};

  private setNameCallback: ((n: string) => void) | null = null;
  private setEmailCallback: ((e: string) => void) | null = null;
  private setAvatarUrlCallback: ((url: string) => void) | null = null;

  private setCurrentPasswordCallback: ((p: string) => void) | null = null;
  private setNewPasswordCallback: ((p: string) => void) | null = null;
  private setConfirmNewPasswordCallback: ((p: string) => void) | null = null;

  private setErrorCallback: ((err: string) => void) | null = null;
  private setSuccessCallback: ((msg: string) => void) | null = null;
  private setFieldErrorsCallback: ((errors: any) => void) | null = null;

  get name() {
    return this._name;
  }
  get email() {
    return this._email;
  }
  get avatarUrl() {
    return this._avatarUrl;
  }
  get currentPassword() {
    return this._currentPassword;
  }
  get newPassword() {
    return this._newPassword;
  }
  get confirmNewPassword() {
    return this._confirmNewPassword;
  }
  get error() {
    return this._error;
  }
  get success() {
    return this._success;
  }
  get fieldErrors() {
    return this._fieldErrors;
  }

  setNameListener(cb: any) {
    this.setNameCallback = cb;
  }
  setEmailListener(cb: any) {
    this.setEmailCallback = cb;
  }
  setAvatarUrlListener(cb: any) {
    this.setAvatarUrlCallback = cb;
  }
  setCurrentPasswordListener(cb: any) {
    this.setCurrentPasswordCallback = cb;
  }
  setNewPasswordListener(cb: any) {
    this.setNewPasswordCallback = cb;
  }
  setConfirmNewPasswordListener(cb: any) {
    this.setConfirmNewPasswordCallback = cb;
  }
  setErrorListener(cb: any) {
    this.setErrorCallback = cb;
  }
  setSuccessListener(cb: any) {
    this.setSuccessCallback = cb;
  }
  setFieldErrorsListener(cb: any) {
    this.setFieldErrorsCallback = cb;
  }

  setName(n: string) {
    this._name = n;
    this.setNameCallback?.(n);
    this.clearFieldError("name");
  }

  setEmail(e: string) {
    this._email = e;
    this.setEmailCallback?.(e);
    this.clearFieldError("email");
  }

  setAvatarUrl(url: string) {
    this._avatarUrl = url;
    this.setAvatarUrlCallback?.(url);
  }

  setCurrentPassword(p: string) {
    this._currentPassword = p;
    this.setCurrentPasswordCallback?.(p);
    this.clearFieldError("currentPassword");
  }

  setNewPassword(p: string) {
    this._newPassword = p;
    this.setNewPasswordCallback?.(p);
    this.clearFieldError("newPassword");
  }

  setConfirmNewPassword(p: string) {
    this._confirmNewPassword = p;
    this.setConfirmNewPasswordCallback?.(p);
    this.clearFieldError("confirmNewPassword");
  }

  private clearFieldError(field: string) {
    if ((this._fieldErrors as any)[field]) {
      this._fieldErrors = { ...this._fieldErrors, [field]: undefined };
      this.setFieldErrorsCallback?.(this._fieldErrors);
    }
  }

  clearMessages() {
    this._error = "";
    this._success = "";
    this._fieldErrors = {};
    this.setErrorCallback?.("");
    this.setSuccessCallback?.("");
    this.setFieldErrorsCallback?.({});
  }

  clearError() {
    this._error = "";
    this.setErrorCallback?.("");
  }

  clearSuccess() {
    this._success = "";
    this.setSuccessCallback?.("");
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async loadProfile(): Promise<void> {
    try {
      const profile = await profileService.fetchUserProfile();
      this.setName(profile.name);
      this.setEmail(profile.email);
      this.setAvatarUrl(profile.avatarUrl || "");
    } catch (err: any) {
      this._error = "Não foi possível carregar os dados do perfil.";
      this.setErrorCallback?.(this._error);
    }
  }

  async performUpdateProfile(): Promise<void> {
    this.clearMessages();
    const errors: { name?: string; email?: string } = {};

    if (!this._name || this._name.trim().length < 3) {
      errors.name = "Insira seu nome completo.";
    }

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
      const updatedProfile = await profileService.updateProfile(
        this._name,
        this._email,
        this._avatarUrl,
      );
      this._success = "Perfil atualizado com sucesso!";
      this.setSuccessCallback?.(this._success);
      this.setName(updatedProfile.name);
      this.setEmail(updatedProfile.email);
      this.setAvatarUrl(updatedProfile.avatarUrl || "");
    } catch (err: any) {
      this._error = err.message || "Erro ao atualizar perfil.";
      this.setErrorCallback?.(this._error);
      throw err;
    }
  }

  async performChangePassword(): Promise<void> {
    this.clearMessages();
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};

    if (!this._currentPassword) {
      errors.currentPassword = "Digite sua senha atual.";
    }

    if (!this._newPassword) {
      errors.newPassword = "Digite uma nova senha.";
    } else if (this._newPassword.length < 6) {
      errors.newPassword = "A nova senha deve ter pelo menos 6 caracteres.";
    }

    if (!this._confirmNewPassword) {
      errors.confirmNewPassword = "Confirme sua nova senha.";
    } else if (this._newPassword !== this._confirmNewPassword) {
      errors.confirmNewPassword = "As senhas não coincidem.";
    }

    if (Object.keys(errors).length > 0) {
      this._fieldErrors = errors;
      this.setFieldErrorsCallback?.(errors);
      throw new Error("Verifique os campos destacados.");
    }

    try {
      await profileService.changePassword(
        this._currentPassword,
        this._newPassword,
      );
      this._success = "Senha alterada com segurança!";
      this.setSuccessCallback?.(this._success);
      this.setCurrentPassword("");
      this.setNewPassword("");
      this.setConfirmNewPassword("");
    } catch (err: any) {
      this._error = err.message || "Erro ao alterar a senha.";
      this.setErrorCallback?.(this._error);
      throw err;
    }
  }
}

export const useProfileViewModel = () => {
  const [viewModel] = useState(() => new ProfileViewModel());
  const [name, setName] = useState(viewModel.name);
  const [email, setEmail] = useState(viewModel.email);
  const [avatarUrl, setAvatarUrl] = useState(viewModel.avatarUrl);

  const [currentPassword, setCurrentPassword] = useState(
    viewModel.currentPassword,
  );
  const [newPassword, setNewPassword] = useState(viewModel.newPassword);
  const [confirmNewPassword, setConfirmNewPassword] = useState(
    viewModel.confirmNewPassword,
  );

  const [error, setError] = useState(viewModel.error);
  const [success, setSuccess] = useState(viewModel.success);
  const [fieldErrors, setFieldErrors] = useState(viewModel.fieldErrors);

  useEffect(() => {
    viewModel.setNameListener(setName);
    viewModel.setEmailListener(setEmail);
    viewModel.setAvatarUrlListener(setAvatarUrl);

    viewModel.setCurrentPasswordListener(setCurrentPassword);
    viewModel.setNewPasswordListener(setNewPassword);
    viewModel.setConfirmNewPasswordListener(setConfirmNewPassword);

    viewModel.setErrorListener(setError);
    viewModel.setSuccessListener(setSuccess);
    viewModel.setFieldErrorsListener(setFieldErrors);

    viewModel.loadProfile();
  }, [viewModel]);

  return {
    viewModel,
    name,
    email,
    avatarUrl,
    currentPassword,
    newPassword,
    confirmNewPassword,
    error,
    success,
    fieldErrors,
  };
};
