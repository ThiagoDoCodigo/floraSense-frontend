import { floraSenseApi, STORAGE_KEYS } from '../../../services/floraSenseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  AuthUserResponseDTO, 
  LoginRequestDTO, 
  AuthResponseDTO,
  PublicCreateUserDTO 
} from '../models/auth.model';

class AuthService {
  async login(data: LoginRequestDTO): Promise<AuthUserResponseDTO> {
    const response = await floraSenseApi.post<AuthResponseDTO>('/auth/login', data);
    
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken],
      [STORAGE_KEYS.USER, JSON.stringify(response.data.user)]
    ]);

    return response.data.user;
  }

  async register(data: PublicCreateUserDTO): Promise<AuthUserResponseDTO> {
    await floraSenseApi.post('/users/public', data);
    return await this.login({ email: data.email, password: data.password });
  }

  async recoverPassword(email: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email) reject(new Error("Email é obrigatório"));
        resolve({ message: "Se o e-mail existir, você receberá um link de recuperação." });
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN, 
      STORAGE_KEYS.REFRESH_TOKEN, 
      STORAGE_KEYS.USER
    ]);
  }

  async getStoredUser(): Promise<AuthUserResponseDTO | null> {
    const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();