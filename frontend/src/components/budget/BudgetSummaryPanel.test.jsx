import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetSummaryPanel } from './BudgetSummaryPanel.jsx';

describe('BudgetSummaryPanel', () => {
  it('exibe totais e permite salvar', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <BudgetSummaryPanel
        totalBudget={1000}
        allocated={800}
        unallocated={200}
        isOverBudget={false}
        categoryAmounts={{
          transport: 200,
          accommodation: 200,
          food: 200,
          activities: 200,
        }}
        onSave={onSave}
        saving={false}
        validating={false}
        disabled={false}
      />
    );

    expect(screen.getByText('Resumo do orçamento')).toBeInTheDocument();
    expect(screen.getByText('Não alocado')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Salvar viagem/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('desabilita salvar quando ultrapassa orçamento', () => {
    render(
      <BudgetSummaryPanel
        totalBudget={1000}
        allocated={1200}
        unallocated={-200}
        isOverBudget
        categoryAmounts={{
          transport: 300,
          accommodation: 300,
          food: 300,
          activities: 300,
        }}
        onSave={() => {}}
        saving={false}
        validating={false}
        disabled={false}
      />
    );

    expect(screen.getByText('Ultrapassado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar viagem/i })).toBeDisabled();
  });
});
