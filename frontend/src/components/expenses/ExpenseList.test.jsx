import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseList } from './ExpenseList.jsx';

const sampleExpense = {
  id: 'exp-1',
  category: 'food',
  amount: '50.00',
  spentAt: '2026-09-02',
  description: 'Almoço',
};

describe('ExpenseList', () => {
  it('mostra estado vazio', () => {
    render(<ExpenseList expenses={[]} loading={false} />);
    expect(screen.getByText('Nenhum gasto registrado ainda.')).toBeInTheDocument();
  });

  it('lista gastos com botões de editar', () => {
    render(
      <ExpenseList
        expenses={[sampleExpense]}
        loading={false}
        tripStartDate="2026-09-01"
        tripEndDate="2026-09-05"
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Almoço')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*50,00/)).toBeInTheDocument();
    expect(screen.getByLabelText('Editar gasto')).toBeInTheDocument();
    expect(screen.getByLabelText('Remover gasto')).toBeInTheDocument();
  });

  it('abre edição inline ao clicar em editar', async () => {
    const user = userEvent.setup();
    render(
      <ExpenseList
        expenses={[sampleExpense]}
        loading={false}
        tripStartDate="2026-09-01"
        tripEndDate="2026-09-05"
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText('Editar gasto'));
    expect(screen.getByRole('button', { name: /Salvar/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/ })).toBeInTheDocument();
  });
});
