import { useMemo } from 'react';
import { BUDGET_CATEGORIES } from '../constants/budgetCategories.js';

/**
 * @param {Record<string, number|string>} categoryAmounts
 * @param {number|string} totalBudget
 */
export function useTripBudgetTotals(categoryAmounts, totalBudget) {
  return useMemo(() => {
    const total = Number(totalBudget) || 0;
    const allocated = BUDGET_CATEGORIES.reduce((sum, cat) => {
      const v = Number(categoryAmounts[cat.key]) || 0;
      return sum + v;
    }, 0);
    const allocatedRounded = Math.round(allocated * 100) / 100;
    const unallocated = Math.round((total - allocatedRounded) * 100) / 100;
    const isOverBudget = allocatedRounded > total;

    return {
      total,
      allocated: allocatedRounded,
      unallocated,
      isOverBudget,
    };
  }, [categoryAmounts, totalBudget]);
}

/** Converte estado local para categoryAmounts da API */
export function toCategoryAmounts(categoryAmounts) {
  return Object.fromEntries(
    BUDGET_CATEGORIES.map((c) => [
      c.key,
      Number(categoryAmounts[c.key]) || 0,
    ])
  );
}

/** Inicializa valores a partir de suggest.suggested */
export function amountsFromSuggestion(suggested) {
  return Object.fromEntries(
    BUDGET_CATEGORIES.map((c) => [
      c.key,
      Number(suggested?.[c.key]) || 0,
    ])
  );
}
