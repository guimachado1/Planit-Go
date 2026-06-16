import { describe, expect, it } from 'vitest';
import { buildCategoryBudgetInsights } from './reportInsights.js';

describe('buildCategoryBudgetInsights', () => {
  const byCategory = [
    { category: 'transport', planned: 200, spent: 250 },
    { category: 'accommodation', planned: 400, spent: 300 },
    { category: 'food', planned: 300, spent: 300 },
    { category: 'activities', planned: 0, spent: 50 },
  ];

  it('lista categorias acima e abaixo do planejado', () => {
    const { overBudget, underBudget } = buildCategoryBudgetInsights(byCategory);

    expect(overBudget).toHaveLength(1);
    expect(overBudget[0].category).toBe('transport');
    expect(overBudget[0].difference).toBe(50);

    expect(underBudget).toHaveLength(1);
    expect(underBudget[0].category).toBe('accommodation');
    expect(underBudget[0].difference).toBe(100);
  });

  it('retorna listas vazias sem categorias', () => {
    const result = buildCategoryBudgetInsights([]);
    expect(result.overBudget).toEqual([]);
    expect(result.underBudget).toEqual([]);
  });
});
