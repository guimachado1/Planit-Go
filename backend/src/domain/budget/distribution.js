import {
  BUDGET_CATEGORIES,
  TRIP_PROFILES,
} from '../../constants/tripProfiles.js';
import { AppError } from '../../errors/AppError.js';

/**
 * Distribui o orçamento total pelos percentuais do perfil (RF02).
 * Ajusta centavos na última categoria para a soma fechar exatamente o total.
 *
 * @param {keyof typeof TRIP_PROFILES} profileKey
 * @param {number} totalBudget
 * @returns {{ lines: Array<{ category: string, plannedAmount: string, source: 'automatic' }>, byCategory: Record<string, string> }}
 */
export function calculateAutomaticDistribution(profileKey, totalBudget) {
  const profile = TRIP_PROFILES[profileKey];
  if (!profile) {
    throw new AppError('Perfil inválido para cálculo de orçamento.', 400);
  }
  if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
    throw new AppError('Orçamento total inválido para distribuição.', 400);
  }

  const amounts = BUDGET_CATEGORIES.map((category) => ({
    category,
    value:
      Math.floor((totalBudget * profile[category]) / 100 * 100) / 100,
  }));

  const sum = amounts.reduce((acc, item) => acc + item.value, 0);
  const diff = Math.round((totalBudget - sum) * 100) / 100;
  if (diff !== 0 && amounts.length > 0) {
    const last = amounts[amounts.length - 1];
    last.value = Math.round((last.value + diff) * 100) / 100;
  }

  const byCategory = Object.fromEntries(
    amounts.map(({ category, value }) => [category, value.toFixed(2)])
  );

  const lines = amounts.map(({ category, value }) => ({
    category,
    plannedAmount: value.toFixed(2),
    source: 'automatic',
  }));

  return { lines, byCategory };
}
