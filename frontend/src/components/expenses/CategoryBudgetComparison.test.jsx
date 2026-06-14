import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBudgetComparison } from './CategoryBudgetComparison.jsx';

const baseSummary = {
  totalBudget: 1000,
  totalSpent: 280,
  byCategory: [
    {
      category: 'transport',
      planned: 120,
      spent: 110,
      remaining: 10,
      percentUsed: 91.7,
      alertLevel: 'warning',
      alertLabel: 'Atenção',
    },
    {
      category: 'accommodation',
      planned: 400,
      spent: 0,
      remaining: 400,
      percentUsed: 0,
      alertLevel: 'ok',
      alertLabel: 'Dentro do limite',
    },
    {
      category: 'food',
      planned: 300,
      spent: 170,
      remaining: 130,
      percentUsed: 56.7,
      alertLevel: 'ok',
      alertLabel: 'Dentro do limite',
    },
    {
      category: 'activities',
      planned: 180,
      spent: 0,
      remaining: 180,
      percentUsed: 0,
      alertLevel: 'ok',
      alertLabel: 'Dentro do limite',
    },
  ],
  alerts: {
    overall: { alertLevel: 'ok' },
    active: [
      {
        category: 'transport',
        percentUsed: 91.7,
        alertLevel: 'warning',
        alertLabel: 'Atenção',
      },
    ],
  },
};

describe('CategoryBudgetComparison', () => {
  it('destaca categoria em atenção sem painel separado', () => {
    render(<CategoryBudgetComparison summary={baseSummary} />);

    expect(screen.getByText(/1 categoria precisa de atenção/i)).toBeInTheDocument();
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('91.7%')).toBeInTheDocument();
    expect(screen.queryByText(/Dentro do limite/i)).not.toBeInTheDocument();
  });

  it('não exibe pill quando tudo está ok', () => {
    render(
      <CategoryBudgetComparison
        summary={{
          byCategory: [
            {
              category: 'food',
              planned: 200,
              spent: 50,
              remaining: 150,
              percentUsed: 25,
              alertLevel: 'ok',
              alertLabel: 'Dentro do limite',
            },
          ],
          alerts: { active: [] },
        }}
      />
    );

    expect(screen.queryByText(/precisa de atenção/i)).not.toBeInTheDocument();
  });
});
