import { renderHook, act } from '@testing-library/react-native';
import { useDashboardViewModel } from '../features/home/viewModels/home.viewModel';
import dashboardService from '../features/home/services/home.service';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../features/home/services/home.service');
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('useDashboardViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { id: '1', name: 'Teste' } });
  });

  it('4. handleMarkAsRead: Deve atualizar o estado local e chamar a API quando online', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
    (dashboardService.markAsRead as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useDashboardViewModel());

   
    act(() => {
    });

    const success = await act(async () => {
      return await result.current.handleMarkAsRead('alerta-123');
    });

    expect(dashboardService.markAsRead).toHaveBeenCalledWith('alerta-123');
    expect(success).toBe(true);
  });

  it('5. handleMarkAsRead: NÃO deve chamar a API, mas deve retornar true se estiver OFFLINE', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

    const { result } = renderHook(() => useDashboardViewModel());

    const success = await act(async () => {
      return await result.current.handleMarkAsRead('alerta-123');
    });

    expect(dashboardService.markAsRead).not.toHaveBeenCalled();
    expect(success).toBe(true);
  });

  it('6. handleMarkAsRead: Deve definir um erro global caso a chamada à API falhe', async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
    (dashboardService.markAsRead as jest.Mock).mockRejectedValue(new Error('API Down'));

    const { result } = renderHook(() => useDashboardViewModel());

    const success = await act(async () => {
      return await result.current.handleMarkAsRead('alerta-erro');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Falha ao marcar alerta como lido no servidor.');
  });
});