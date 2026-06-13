import { render } from '@testing-library/react-native';
import { EmptyState } from '../../src/components/EmptyState';

describe('EmptyState', () => {
  it('exibe o titulo e a mensagem padrao quando nenhuma prop e fornecida', async () => {
    const { getByText } = await render(<EmptyState />);

    expect(getByText('Nenhum dado recebido')).toBeTruthy();
    expect(getByText('Ainda não há registros.')).toBeTruthy();
  });

  it('exibe o titulo e a mensagem customizados via props', async () => {
    const { getByText } = await render(
      <EmptyState
        title="Sem plantas"
        message="Cadastre sua primeira planta"
      />,
    );

    expect(getByText('Sem plantas')).toBeTruthy();
    expect(getByText('Cadastre sua primeira planta')).toBeTruthy();
  });
});
