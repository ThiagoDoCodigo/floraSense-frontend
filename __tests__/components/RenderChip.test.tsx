import { render, fireEvent } from '@testing-library/react-native';
import RenderChip from '../../src/components/RenderChip';

describe('RenderChip', () => {
  it('exibe a label do chip', async () => {
    const { getByText } = await render(
      <RenderChip
        label="Germinação"
        isSelected={false}
        onPress={jest.fn()}
        saving={false}
      />,
    );

    expect(getByText('Germinação')).toBeTruthy();
  });

  it('chama onPress ao tocar no chip', async () => {
    const onPress = jest.fn();

    const { getByText } = await render(
      <RenderChip
        label="Floração"
        isSelected={false}
        onPress={onPress}
        saving={false}
      />,
    );

    fireEvent.press(getByText('Floração'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('nao chama onPress quando saving e true', async () => {
    const onPress = jest.fn();

    const { getByText } = await render(
      <RenderChip
        label="Maturação"
        isSelected={false}
        onPress={onPress}
        saving={true}
      />,
    );

    fireEvent.press(getByText('Maturação'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
