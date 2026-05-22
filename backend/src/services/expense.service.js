import { BUDGET_CATEGORIES } from '../constants/tripProfiles.js';
import * as expenseRepo from '../repositories/expense.repository.js';
import * as tripRepo from '../repositories/trip.repository.js';

const CAT_SET = new Set(BUDGET_CATEGORIES);

function parseMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

export async function addExpense(userId, tripId, body) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) {
    const err = new Error('Viagem não encontrada.');
    err.status = 404;
    throw err;
  }
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
  const desc =
    body.description != null ? String(body.description).slice(0, 2000) : null;

  return expenseRepo.insertExpense({
    tripId,
    category,
    amount: amount.toFixed(2),
    spentAt,
    description: desc,
  });
}

export async function listExpenses(userId, tripId) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) {
    const err = new Error('Viagem não encontrada.');
    err.status = 404;
    throw err;
  }
  return expenseRepo.listExpensesByTrip(tripId);
}

/**
 * Resumo planejado vs real por categoria + totais (RF03, RF05 base).
 */
export async function getFinancialSummary(userId, tripId) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) {
    const err = new Error('Viagem não encontrada.');
    err.status = 404;
    throw err;
  }
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

  return {
    tripId: trip.id,
    destination: trip.destination,
    totalBudget: totalPlanned,
    totalSpent,
    totalRemaining,
    byCategory: categories,
  };
}
