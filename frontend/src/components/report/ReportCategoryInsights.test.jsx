import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportCategoryInsights } from './ReportCategoryInsights.jsx';

describe('ReportCategoryInsights', () => {
  it('mostra mensagem quando não há insights', () => {
    render(
      <ReportCategoryInsights
        isFinal={false}
        summary={{
          byCategory: [
            { category: 'food', planned: 100, spent: 100, remaining: 0 },
          ],
        }}
      />
    );

    expect(
      screen.getByText(/Nenhuma categoria acima ou abaixo do planejado/)
    ).toBeInTheDocument();
  });

  it('lista categorias acima do orçamento', () => {
    render(
      <ReportCategoryInsights
        isFinal
        summary={{
          byCategory: [
            { category: 'food', planned: 100, spent: 150, remaining: -50 },
          ],
        }}
      />
    );

    expect(screen.getByText('Acima do orçamento')).toBeInTheDocument();
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
  });
});
