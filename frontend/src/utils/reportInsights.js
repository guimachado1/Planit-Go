import { getCategoryLabel } from '../constants/budgetCategories.js';
import { percentUsed } from './financial.js';

/**
 * Agrupa categorias acima e abaixo do planejado (RF05).
 * @param {Array<{ category: string, planned: number, spent: number, remaining?: number }>} byCategory
 */
export function buildCategoryBudgetInsights(byCategory) {
  if (!byCategory?.length) {
    return { overBudget: [], underBudget: [] };
  }

  const withPlan = byCategory.filter((row) => Number(row.planned) > 0);

  const overBudget = withPlan
    .filter((row) => Number(row.spent) > Number(row.planned))
    .map((row) => ({
      category: row.category,
      label: getCategoryLabel(row.category),
      planned: Number(row.planned),
      spent: Number(row.spent),
      difference: Math.round((Number(row.spent) - Number(row.planned)) * 100) / 100,
      percentUsed: percentUsed(row.spent, row.planned),
    }));

  const underBudget = withPlan
    .filter((row) => Number(row.spent) < Number(row.planned))
    .map((row) => ({
      category: row.category,
      label: getCategoryLabel(row.category),
      planned: Number(row.planned),
      spent: Number(row.spent),
      difference: Math.round((Number(row.planned) - Number(row.spent)) * 100) / 100,
      percentUsed: percentUsed(row.spent, row.planned),
    }));

  return { overBudget, underBudget };
}
