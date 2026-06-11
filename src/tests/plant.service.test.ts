import plantService from '../features/plants/services/plant.service';
import { floraSenseApi } from '../services/floraSenseApi';

jest.mock('../services/floraSenseApi');

it('deve buscar plantas com filtros corretamente', async () => {
    const mockPlants = { data: [], total: 0, page: 1, totalPages: 1 };
    (floraSenseApi.get as jest.Mock).mockResolvedValue({ data: mockPlants });

    await plantService.getPlants({ page: 1, name: 'Orquídea' });

    const calledUrl = (floraSenseApi.get as jest.Mock).mock.calls[0][0];
    
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('limit=10');
    expect(decodeURIComponent(calledUrl)).toContain('name=Orquídea');
    
  });
describe('PlantService - Upload de Imagem', () => {
  it('1. Deve enviar um FormData corretamente ao adicionar uma planta com imagem local', async () => {
    const mockPayload = { name: 'Costela de Adão', especie: 'Monstera' };
    const mockImageUri = 'file://caminho/para/imagem.jpg';
    const mockResponse = { id: '123', ...mockPayload, imageUrl: 'http://s3...' };

    (floraSenseApi.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await plantService.addPlant(mockPayload, mockImageUri);

    expect(floraSenseApi.post).toHaveBeenCalledWith(
      '/plants',
      expect.any(FormData), 
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
    
    const formDataArg = (floraSenseApi.post as jest.Mock).mock.calls[0][1];
    expect(formDataArg.get('name')).toBe('Costela de Adão');
    expect(formDataArg.get('file')).toBeTruthy(); 
    
    expect(result).toEqual(mockResponse);
  });
});