import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpenseList } from './ExpenseList.jsx';

describe('ExpenseList', () => {
  it('mostra estado vazio', () => {
    render(<ExpenseList expenses={[]} loading={false} />);
    expect(screen.getByText('Nenhum gasto registrado ainda.')).toBeInTheDocument();
  });

  it('lista gastos', () => {
    render(
      <ExpenseList
        expenses={[
          {
            id: '1',
            category: 'food',
            amount: '50.00',
            spentAt: '2026-09-02',
            description: 'Almoço',
          },
        ]}
        loading={false}
      />
    );

    expect(screen.getByText('Almoço')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*50,00/)).toBeInTheDocument();
  });
});
