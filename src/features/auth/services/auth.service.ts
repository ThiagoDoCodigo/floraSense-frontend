import {
  floraSenseApi,
  STORAGE_KEYS,
  setInMemoryToken,
} from "../../../services/floraSenseApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AuthUserResponseDTO,
  LoginRequestDTO,
  AuthResponseDTO,
  PublicCreateUserDTO,
  ResetPasswordRequestDTO,
} from "../models/auth.model";

class AuthService {
  async login(data: LoginRequestDTO): Promise<AuthUserResponseDTO> {
    const response = await floraSenseApi.post<AuthResponseDTO>(
      "/auth/login",
      data,
    );

    const currentNotifyPref = await AsyncStorage.getItem(
      "receiptNotifications",
    );
    if (!currentNotifyPref) {
      await AsyncStorage.setItem("receiptNotifications", "true");
    }

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken],
      [STORAGE_KEYS.USER, JSON.stringify(response.data.user)],
    ]);

    setInMemoryToken(response.data.tokens.accessToken);

    return response.data.user;
  }

  async register(data: PublicCreateUserDTO): Promise<AuthUserResponseDTO> {
    await floraSenseApi.post("/users/public", data);
    return await this.login({ email: data.email, password: data.password });
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
    setInMemoryToken(null);
  }

  async getStoredUser(): Promise<AuthUserResponseDTO | null> {
    const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (userStr && token) {
      setInMemoryToken(token);
      return JSON.parse(userStr);
    }

    return null;
  }

  async recoverPassword(email: string): Promise<{ message: string }> {
    const response = await floraSenseApi.post("/users/forgot-password", {
      email,
    });
    return response.data;
  }

  async resetPassword(
    data: ResetPasswordRequestDTO,
  ): Promise<{ message: string }> {
    const response = await floraSenseApi.post("/users/reset-password", data);
    return response.data;
  }
}

export default new AuthService();
