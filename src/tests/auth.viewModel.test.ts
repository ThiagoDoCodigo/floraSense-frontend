import { renderHook, act } from '@testing-library/react-native';
import { useAuthViewModel } from '../features/auth/viewModel/auth.viewModel';
import { useAuth } from '../contexts/AuthContext';
import NetInfo from '@react-native-community/netinfo';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

describe('useAuthViewModel', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ signIn: mockSignIn });
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
  });

  it('3. Deve validar e bloquear o login se o email for inválido', async () => {
    const { result } = renderHook(() => useAuthViewModel());

    act(() => {
      result.current.setEmail('email_sem_arroba.com');
      result.current.setPassword('senha123');
    });

    await act(async () => {
      try {
        await result.current.performLogin();
      } catch (e) {
        // Erro esperado
      }
    });

    expect(result.current.fieldErrors.email).toBe('Formato inválido.');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('4. Deve falhar e definir erro global se não houver conexão com a internet', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });
    const { result } = renderHook(() => useAuthViewModel());

    act(() => {
      result.current.setEmail('teste@teste.com');
      result.current.setPassword('123456');
    });

    await act(async () => {
      try {
        await result.current.performLogin();
      } catch (e) { }
    });

    expect(result.current.globalError).toContain('Sem conexão com a internet');
  });

  it('5. Deve validar que a palavra-passe e a confirmação coincidem no registo', async () => {
    const { result } = renderHook(() => useAuthViewModel());

    act(() => {
      result.current.setName('Maria');
      result.current.setEmail('maria@teste.com');
      result.current.setPassword('senha123');
      result.current.setConfirmPassword('senhaDIFERENTE');
    });

    await act(async () => {
      try {
        await result.current.performRegister();
      } catch (e) { }
    });

    expect(result.current.fieldErrors.confirmPassword).toBe('As senhas não coincidem.');
  });
});