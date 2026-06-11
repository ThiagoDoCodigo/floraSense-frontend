import authService from '../features/auth/services/auth.service';
import { floraSenseApi, STORAGE_KEYS, setInMemoryToken } from '../services/floraSenseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../services/floraSenseApi', () => ({
  floraSenseApi: { post: jest.fn() },
  STORAGE_KEYS: { ACCESS_TOKEN: 'accessToken', REFRESH_TOKEN: 'refreshToken', USER: 'user' },
  setInMemoryToken: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Deve realizar login, guardar tokens no AsyncStorage e definir token em memória', async () => {
    const mockResponse = {
      data: {
        tokens: { accessToken: 'token123', refreshToken: 'refresh123' },
        user: { id: '1', name: 'João', email: 'joao@teste.com' },
      },
    };
    (floraSenseApi.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await authService.login({ email: 'joao@teste.com', password: '123' });

    expect(floraSenseApi.post).toHaveBeenCalledWith('/auth/login', { email: 'joao@teste.com', password: '123' });
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      [STORAGE_KEYS.ACCESS_TOKEN, 'token123'],
      [STORAGE_KEYS.REFRESH_TOKEN, 'refresh123'],
      [STORAGE_KEYS.USER, JSON.stringify(mockResponse.data.user)],
    ]);
    expect(setInMemoryToken).toHaveBeenCalledWith('token123');
    expect(result).toEqual(mockResponse.data.user);
  });

  it('2. Deve limpar todos os dados de autenticação ao fazer logout', async () => {
    await authService.logout();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
    expect(setInMemoryToken).toHaveBeenCalledWith(null);
  });
});