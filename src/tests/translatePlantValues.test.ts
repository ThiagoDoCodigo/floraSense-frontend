import { phaseTranslations } from '../features/plants/utils/translatePlantValues';
import { PlantPhaseEnum } from '../features/plants/models/plant.model';

describe('translatePlantValues', () => {
  it('deve traduzir corretamente as fases da planta', () => {
    expect(phaseTranslations[PlantPhaseEnum.SEED]).toBe('Semente');
    expect(phaseTranslations[PlantPhaseEnum.HARVEST]).toBe('Colheita');
  });
});