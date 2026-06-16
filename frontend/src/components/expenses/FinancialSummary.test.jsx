import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinancialSummary } from './FinancialSummary.jsx';

describe('FinancialSummary', () => {
  it('retorna null sem resumo', () => {
    const { container } = render(<FinancialSummary summary={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('exibe totais e utilização', () => {
    render(
      <FinancialSummary
        summary={{
          totalBudget: 1000,
          totalSpent: 600,
          totalRemaining: 400,
        }}
      />
    );

    expect(screen.getByText('Resumo financeiro')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });
});
