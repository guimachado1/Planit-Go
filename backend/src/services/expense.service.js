import { BUDGET_CATEGORIES } from '../constants/tripProfiles.js';
import { normalizeDateOnly } from '../domain/dateOnly.js';
import { buildBudgetAlertSummary } from '../domain/budget/budgetAlerts.js';
import * as expenseRepo from '../repositories/expense.repository.js';
import * as tripRepo from '../repositories/trip.repository.js';

const CAT_SET = new Set(BUDGET_CATEGORIES);

function parseMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function notFoundTrip() {
  const err = new Error('Viagem não encontrada.');
  err.status = 404;
  return err;
}

function notFoundExpense() {
  const err = new Error('Gasto não encontrado.');
  err.status = 404;
  return err;
}

async function requireTrip(userId, tripId) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) throw notFoundTrip();
  return trip;
}

function validateExpenseFields(trip, body) {
  const category = body.category;
  if (!CAT_SET.has(category)) {
    const err = new Error('Categoria inválida.');
    err.status = 400;
    throw err;
  }
  const amount = parseMoney(body.amount);
  if (amount === null || amount <= 0) {
    const err = new Error('Valor do gasto inválido.');
    err.status = 400;
    throw err;
  }
  const spentAt = body.spentAt || body.spent_at;
  if (!spentAt) {
    const err = new Error('Informe a data do gasto (spentAt).');
    err.status = 400;
    throw err;
  }
  const spentDay = normalizeDateOnly(spentAt);
  if (!spentDay) {
    const err = new Error('Data do gasto inválida.');
    err.status = 400;
    throw err;
  }
  const tripStart = normalizeDateOnly(trip.start_date);
  const tripEnd = normalizeDateOnly(trip.end_date);
  if (spentDay < tripStart || spentDay > tripEnd) {
    const err = new Error(
      'A data do gasto deve estar dentro do período da viagem.'
    );
    err.status = 400;
    throw err;
  }
  const description =
    body.description != null ? String(body.description).slice(0, 2000) : null;

  return {
    category,
    amount: amount.toFixed(2),
    spentAt: spentDay,
    description,
  };
}

export async function addExpense(userId, tripId, body) {
  const trip = await requireTrip(userId, tripId);
  const validated = validateExpenseFields(trip, body);
  return expenseRepo.insertExpense({ tripId, ...validated });
}

export async function updateExpense(userId, tripId, expenseId, body) {
  const trip = await requireTrip(userId, tripId);
  const existing = await expenseRepo.getExpenseForTrip(expenseId, tripId);
  if (!existing) throw notFoundExpense();

  const validated = validateExpenseFields(trip, body);
  const updated = await expenseRepo.updateExpense(expenseId, tripId, validated);
  if (!updated) throw notFoundExpense();
  return updated;
}

export async function deleteExpense(userId, tripId, expenseId) {
  await requireTrip(userId, tripId);
  const existing = await expenseRepo.getExpenseForTrip(expenseId, tripId);
  if (!existing) throw notFoundExpense();
  await expenseRepo.deleteExpense(expenseId, tripId);
}

export async function listExpenses(userId, tripId) {
  await requireTrip(userId, tripId);
  return expenseRepo.listExpensesByTrip(tripId);
}

/**
 * Resumo planejado vs real por categoria + totais (RF03, RF05 base).
 */
export async function getFinancialSummary(userId, tripId) {
  const trip = await requireTrip(userId, tripId);
  const budgetLines = await tripRepo.getBudgetLines(tripId);
  const spentRows = await expenseRepo.sumExpensesByCategory(tripId);

  const plannedByCat = Object.fromEntries(
    budgetLines.map((b) => [b.category, Number(b.planned_amount)])
  );
  const spentByCat = Object.fromEntries(
    spentRows.map((r) => [r.category, Number(r.total)])
  );

  const categories = BUDGET_CATEGORIES.map((c) => {
    const planned = plannedByCat[c] ?? 0;
    const spent = spentByCat[c] ?? 0;
    return {
      category: c,
      planned,
      spent,
      remaining: Math.round((planned - spent) * 100) / 100,
    };
  });

  const totalPlanned = Number(trip.total_budget);
  const totalSpent = categories.reduce((a, x) => a + x.spent, 0);
  const totalRemaining = Math.round((totalPlanned - totalSpent) * 100) / 100;

  const { byCategory, alerts } = buildBudgetAlertSummary(
    categories,
    totalPlanned,
    totalSpent
  );

  return {
    tripId: trip.id,
    destination: trip.destination,
    totalBudget: totalPlanned,
    totalSpent,
    totalRemaining,
    byCategory,
    alerts,
  };
}
