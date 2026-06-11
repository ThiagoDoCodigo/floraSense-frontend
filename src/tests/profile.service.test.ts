import profileService from '../features/profile/services/profile.service';
import { floraSenseApi } from '../services/floraSenseApi';


jest.mock('../services/floraSenseApi');

describe('ProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Deve atualizar o perfil enviando o payload correto', async () => {
  
    const mockResponse = { id: '1', name: 'Bárbara', email: 'barbara@teste.com' };
    (floraSenseApi.patch as jest.Mock).mockResolvedValue({ data: mockResponse });

  
    const result = await profileService.updateProfile('Bárbara', 'barbara@teste.com');

    
    expect(floraSenseApi.patch).toHaveBeenCalledWith('/users/self', {
      name: 'Bárbara',
      email: 'barbara@teste.com',
    });
    expect(result).toEqual(mockResponse);
  });

  it('2. Deve alterar a senha enviando os dados corretos', async () => {
    
    (floraSenseApi.patch as jest.Mock).mockResolvedValue({ data: { success: true } });

   
    await profileService.changePassword('senhaAntiga123', 'novaSenha456');

    expect(floraSenseApi.patch).toHaveBeenCalledWith('/users/self/password', {
      currentPassword: 'senhaAntiga123',
      newPassword: 'novaSenha456',
    });
  });
});