import {
  BUDGET_CATEGORIES,
  TRIP_PROFILES,
  isValidProfileKey,
} from '../../constants/tripProfiles.js';
import { AppError } from '../../errors/AppError.js';
import { calculateAutomaticDistribution } from '../budget/distribution.js';
import { buildBudgetSummary } from './budgetSummary.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @param {unknown} value
 * @returns {number|null}
 */
export function parseMoney(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return null;
  }
  return Math.round(n * 100) / 100;
}

export function validateDestination(destination) {
  const dest = String(destination ?? '').trim();
  if (dest.length < 2) {
    throw new AppError('Informe o destino com pelo menos 2 caracteres.', 400);
  }
  if (dest.length > 500) {
    throw new AppError('Destino muito longo (máximo 500 caracteres).', 400);
  }
  return dest;
}

export function validateDateField(value, fieldName) {
  const raw = String(value ?? '').trim();
  if (!DATE_RE.test(raw)) {
    throw new AppError(
      `${fieldName} inválida. Use o formato AAAA-MM-DD.`,
      400
    );
  }
  const date = new Date(`${raw}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${fieldName} inválida.`, 400);
  }
  return raw;
}

export function validateTripDates(startDate, endDate) {
  const start = validateDateField(startDate, 'startDate');
  const end = validateDateField(endDate, 'endDate');
  const s = new Date(`${start}T12:00:00Z`);
  const e = new Date(`${end}T12:00:00Z`);
  if (e < s) {
    throw new AppError(
      'A data final deve ser maior ou igual à data inicial.',
      400
    );
  }
  return { startDate: start, endDate: end };
}

export function validateProfile(profile) {
  const key = String(profile ?? '').trim();
  if (!isValidProfileKey(key)) {
    throw new AppError(
      'Perfil inválido. Use: urban, beach, international ou backpacker.',
      400
    );
  }
  return key;
}

export function validateTotalBudget(totalBudget) {
  const total = parseMoney(totalBudget);
  if (total === null || total <= 0) {
    throw new AppError(
      'Orçamento total deve ser um número positivo.',
      400
    );
  }
  if (total > 99_999_999.99) {
    throw new AppError('Orçamento total acima do limite permitido.', 400);
  }
  return total;
}

/**
 * Resolve linhas de orçamento: automático pelo perfil ou ajuste manual completo.
 *
 * @param {{ profile: string, totalBudget: number, categoryAmounts?: Record<string, unknown> | null }} input
 */
export function resolveBudgetLines({ profile, totalBudget, categoryAmounts }) {
  const hasManual =
    categoryAmounts != null &&
    typeof categoryAmounts === 'object' &&
    Object.keys(categoryAmounts).length > 0;

  if (!hasManual) {
    const { lines } = calculateAutomaticDistribution(profile, totalBudget);
    return {
      lines,
      summary: buildBudgetSummary(totalBudget, lines),
      distributionMode: 'automatic',
    };
  }

  const unknown = Object.keys(categoryAmounts).filter(
    (key) => !BUDGET_CATEGORIES.includes(key)
  );
  if (unknown.length > 0) {
    throw new AppError(
      `Categoria inválida: ${unknown.join(', ')}.`,
      400
    );
  }

  const lines = [];
  let sum = 0;

  for (const category of BUDGET_CATEGORIES) {
    if (categoryAmounts[category] === undefined) {
      throw new AppError(
        `Informe o valor planejado para a categoria: ${category}.`,
        400
      );
    }
    const amount = parseMoney(categoryAmounts[category]);
    if (amount === null || amount < 0) {
      throw new AppError(`Valor inválido para a categoria ${category}.`, 400);
    }
    sum += amount;
    lines.push({
      category,
      plannedAmount: amount.toFixed(2),
      source: 'manual',
    });
  }

  const sumRounded = Math.round(sum * 100) / 100;
  if (sumRounded > totalBudget) {
    throw new AppError(
      'A soma das categorias não pode ultrapassar o orçamento total.',
      400
    );
  }

  return {
    lines,
    summary: buildBudgetSummary(totalBudget, lines),
    distributionMode: 'manual',
  };
}

/**
 * Valida payload de preview ou criação (campos de viagem + orçamento).
 *
 * @param {object} input
 */
export function validateTripBudgetPayload(input) {
  const profile = validateProfile(input.profile);
  const totalBudget = validateTotalBudget(input.totalBudget);
  const budget = resolveBudgetLines({
    profile,
    totalBudget,
    categoryAmounts: input.categoryAmounts,
  });

  return {
    profile,
    profileLabel: TRIP_PROFILES[profile].label,
    totalBudget,
    ...budget,
  };
}

/**
 * @param {object} input
 */
export function validateCreateTripPayload(input) {
  const destination = validateDestination(input.destination);
  const { startDate, endDate } = validateTripDates(
    input.startDate,
    input.endDate
  );
  const budgetPayload = validateTripBudgetPayload(input);

  return {
    destination,
    startDate,
    endDate,
    ...budgetPayload,
  };
}
