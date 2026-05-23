import {
  BUDGET_CATEGORIES,
  TRIP_PROFILES,
} from '../constants/tripProfiles.js';
import { calculateAutomaticDistribution } from '../domain/budget/distribution.js';
import { buildBudgetSummary } from '../domain/trip/budgetSummary.js';
import {
  validateProfile,
  validateTotalBudget,
  validateTripBudgetPayload,
} from '../domain/trip/tripValidation.js';

/**
 * Sugestão automática sem persistir (para o front exibir antes de salvar).
 */
export function suggestBudget({ profile, totalBudget }) {
  const profileKey = validateProfile(profile);
  const total = validateTotalBudget(totalBudget);
  const { lines, byCategory } = calculateAutomaticDistribution(
    profileKey,
    total
  );
  const percentages = Object.fromEntries(
    BUDGET_CATEGORIES.map((cat) => [cat, TRIP_PROFILES[profileKey][cat]])
  );

  return {
    profile: profileKey,
    profileLabel: TRIP_PROFILES[profileKey].label,
    totalBudget: total.toFixed(2),
    percentages,
    suggested: byCategory,
    lines,
    summary: buildBudgetSummary(total, lines),
    distributionMode: 'automatic',
  };
}

/**
 * Preview com sugestão automática ou validação de ajuste manual.
 */
export function previewBudget(body) {
  return validateTripBudgetPayload(body);
}
