import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from './ExpenseForm.jsx';

describe('ExpenseForm', () => {
  it('valida campos obrigatórios', async () => {
    render(
      <ExpenseForm
        onSubmit={vi.fn()}
        tripStartDate="2026-09-01"
        tripEndDate="2026-09-05"
      />
    );

    const form = screen.getByRole('button', { name: /Registrar gasto/i }).closest('form');
    fireEvent.submit(form);
    expect(screen.getByText('Preencha categoria, valor e data.')).toBeInTheDocument();
  });

  it('envia gasto válido', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ExpenseForm
        onSubmit={onSubmit}
        tripStartDate="2026-09-01"
        tripEndDate="2026-09-05"
      />
    );

    await user.selectOptions(screen.getByLabelText('Categoria'), 'food');
    await user.type(screen.getByLabelText('Valor (R$)'), '45');
    await user.type(screen.getByLabelText('Data'), '2026-09-02');
    await user.click(screen.getByRole('button', { name: /Registrar gasto/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      category: 'food',
      amount: 45,
      spentAt: '2026-09-02',
      description: undefined,
    });
  });
});
