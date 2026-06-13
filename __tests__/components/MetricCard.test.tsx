import { render } from '@testing-library/react-native';
import { MetricCard } from '../../src/components/MetricCard';
import { View } from 'react-native';

const MockIcon = (props: any) => <View testID="mock-icon" {...props} />;

describe('MetricCard', () => {
  it('exibe o titulo da metrica corretamente', async () => {
    const { getByText } = await render(
      <MetricCard
        title="Total de Plantas"
        value={12}
        icon={MockIcon}
        color="#22c55e"
        bgColor="#f0fdf4"
      />,
    );

    expect(getByText('Total de Plantas')).toBeTruthy();
  });

  it('exibe o valor numerico da metrica', async () => {
    const { getByText } = await render(
      <MetricCard
        title="Total de Plantas"
        value={12}
        icon={MockIcon}
        color="#22c55e"
        bgColor="#f0fdf4"
      />,
    );

    expect(getByText('12')).toBeTruthy();
  });

  it('exibe o valor em formato de string com unidade', async () => {
    const { getByText } = await render(
      <MetricCard
        title="Umidade do Solo"
        value="65%"
        icon={MockIcon}
        color="#3b82f6"
        bgColor="#eff6ff"
      />,
    );

    expect(getByText('65%')).toBeTruthy();
    expect(getByText('Umidade do Solo')).toBeTruthy();
  });
});
