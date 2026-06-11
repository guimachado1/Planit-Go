import { describe, expect, it } from 'vitest';
import {
  BUDGET_CATEGORIES,
  EMPTY_CATEGORY_AMOUNTS,
  getCategoryLabel,
} from './budgetCategories.js';

describe('budgetCategories', () => {
  it('define quatro categorias', () => {
    expect(BUDGET_CATEGORIES.map((c) => c.key)).toEqual([
      'transport',
      'accommodation',
      'food',
      'activities',
    ]);
  });

  it('resolve label da categoria', () => {
    expect(getCategoryLabel('food')).toBe('Alimentação');
  });

  it('inicializa valores zerados', () => {
    expect(EMPTY_CATEGORY_AMOUNTS()).toEqual({
      transport: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
    });
  });
});
