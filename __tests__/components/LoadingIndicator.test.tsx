import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renderiza o ActivityIndicator na tela', async () => {
    const { getByTestId } = await render(<LoadingIndicator />);

    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('exibe a mensagem e a submensagem padrao', async () => {
    const { getByText } = await render(<LoadingIndicator />);

    expect(getByText('Carregando...')).toBeTruthy();
    expect(getByText('Aguarde um momento')).toBeTruthy();
  });

  it('exibe mensagens customizadas via props', async () => {
    const { getByText } = await render(
      <LoadingIndicator
        message="Buscando plantas..."
        subMessage="Isso pode levar alguns segundos"
      />,
    );

    expect(getByText('Buscando plantas...')).toBeTruthy();
    expect(getByText('Isso pode levar alguns segundos')).toBeTruthy();
  });
});
