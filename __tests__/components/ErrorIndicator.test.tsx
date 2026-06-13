import { render, fireEvent } from '@testing-library/react-native';
import { ErrorIndicator } from '../../src/components/ErrorIndicator';

describe('ErrorIndicator', () => {
  it('exibe o titulo e a mensagem de erro padrao', async () => {
    const { getByText } = await render(<ErrorIndicator />);

    expect(getByText('Falha na Conexão')).toBeTruthy();
    expect(getByText('Não foi possível carregar os dados no momento.')).toBeTruthy();
  });

  it('exibe o titulo e a mensagem de erro customizados', async () => {
    const { getByText } = await render(
      <ErrorIndicator
        title="Servidor Indisponível"
        message="Tente novamente mais tarde"
      />,
    );

    expect(getByText('Servidor Indisponível')).toBeTruthy();
    expect(getByText('Tente novamente mais tarde')).toBeTruthy();
  });

  it('exibe o botao Tentar Novamente e chama onRetry ao tocar', async () => {
    const onRetry = jest.fn();

    const { getByText } = await render(<ErrorIndicator onRetry={onRetry} />);

    const botao = getByText('Tentar Novamente');
    expect(botao).toBeTruthy();

    fireEvent.press(botao);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('nao exibe o botao quando onRetry nao e fornecido', async () => {
    const { queryByText } = await render(<ErrorIndicator />);

    expect(queryByText('Tentar Novamente')).toBeNull();
  });
});
