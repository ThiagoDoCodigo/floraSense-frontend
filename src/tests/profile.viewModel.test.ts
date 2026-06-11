import { renderHook, act } from '@testing-library/react-native';
import { useProfileViewModel } from '../features/profile/viewModels/profile.viewModel';
import profileService from '../features/profile/services/profile.service';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { configureTheme } from 'react-native-th-components';

jest.mock('../features/profile/services/profile.service');

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  setColorScheme: jest.fn(),
}));

jest.mock('react-native-th-components', () => ({
  configureTheme: jest.fn(),
}));

const mockUser = { name: 'Bárbara Ferreira', email: 'barbara@teste.com', avatarUrl: '' };
const mockUpdateUserProfile = jest.fn();
const mockSignOut = jest.fn();

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser, 
    updateUserProfile: mockUpdateUserProfile,
    signOut: mockSignOut,
  }),
}));

describe('useProfileViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true, isInternetReachable: true });
  });

  describe('Inicialização e Temas', () => {
    it('1. Deve inicializar os campos com os dados do AuthContext', () => {
      const { result } = renderHook(() => useProfileViewModel());
      expect(result.current.name).toBe('Bárbara Ferreira');
      expect(result.current.email).toBe('barbara@teste.com');
    });

    it('2. Deve alterar a preferência de tema e gravar no AsyncStorage', async () => {
      const { result } = renderHook(() => useProfileViewModel());

      await act(async () => {
        await result.current.changeTheme('dark');
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme_preference', 'dark');
      expect(Appearance.setColorScheme).toHaveBeenCalledWith('dark');
      expect(configureTheme).toHaveBeenCalledWith(expect.objectContaining({ themeName: 'dark' }));
    });
  });

  describe('Validações de Atualização de Perfil', () => {
    it('3. Deve validar e impedir atualização com nome curto e e-mail inválido', async () => {
      const { result } = renderHook(() => useProfileViewModel());

      act(() => {
        result.current.setName('Ba'); 
        result.current.setEmail('email-invalido');
      });

      await act(async () => {
        try {
          await result.current.performUpdateProfile();
        } catch (e) {
          
        }
      });

      expect(result.current.fieldErrors.name).toBe('Insira seu nome completo (mín. 3 letras).');
      expect(result.current.fieldErrors.email).toBe('Formato de e-mail inválido.');
      expect(profileService.updateProfile).not.toHaveBeenCalled(); 
    });

    it('4. Deve bloquear a atualização se o utilizador estiver OFFLINE', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false, isInternetReachable: false });

      const { result } = renderHook(() => useProfileViewModel());

      await act(async () => {
        try {
          await result.current.performUpdateProfile();
        } catch (e) {}
      });

      expect(result.current.error).toBe('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
      expect(profileService.updateProfile).not.toHaveBeenCalled();
    });

    it('5. Deve atualizar o perfil na API e no Contexto Global com sucesso', async () => {
      const updatedData = { name: 'Bárbara Santos', email: 'barbara.santos@teste.com', avatarUrl: '' };
      (profileService.updateProfile as jest.Mock).mockResolvedValue(updatedData);

      const { result } = renderHook(() => useProfileViewModel());

      act(() => {
        result.current.setName('Bárbara Santos');
        result.current.setEmail('barbara.santos@teste.com');
      });

      await act(async () => {
        await result.current.performUpdateProfile();
      });

      expect(profileService.updateProfile).toHaveBeenCalledWith('Bárbara Santos', 'barbara.santos@teste.com', '');
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(updatedData);
      expect(result.current.success).toBe('Perfil atualizado com sucesso!');
    });
  });

  describe('Alteração de Senha', () => {
    it('6. Deve impedir a alteração se a nova senha for menor que 6 caracteres ou não coincidir', async () => {
      const { result } = renderHook(() => useProfileViewModel());

      act(() => {
        result.current.setCurrentPassword('senhaAtual');
        result.current.setNewPassword('12345'); 
        result.current.setConfirmNewPassword('123456'); 
      });

      await act(async () => {
        try { await result.current.performChangePassword(); } catch (e) {}
      });

      expect(result.current.fieldErrors.newPassword).toBe('A nova senha deve ter pelo menos 6 caracteres.');
      expect(result.current.fieldErrors.confirmNewPassword).toBe('As senhas não coincidem.');
      expect(profileService.changePassword).not.toHaveBeenCalled();
    });

    it('7. Deve limpar os campos e mostrar sucesso após alterar a senha na API', async () => {
      (profileService.changePassword as jest.Mock).mockResolvedValue({});
      const { result } = renderHook(() => useProfileViewModel());

      act(() => {
        result.current.setCurrentPassword('senhaAntiga123');
        result.current.setNewPassword('novaSenhaSegura');
        result.current.setConfirmNewPassword('novaSenhaSegura');
      });

      await act(async () => {
        await result.current.performChangePassword();
      });

      expect(profileService.changePassword).toHaveBeenCalledWith('senhaAntiga123', 'novaSenhaSegura');
      expect(result.current.success).toBe('Senha alterada com segurança!');
      
      expect(result.current.currentPassword).toBe('');
      expect(result.current.newPassword).toBe('');
      expect(result.current.confirmNewPassword).toBe('');
    });
  });
});