import { pool } from '../config/database.js';
import {
  BUDGET_CATEGORIES,
  isValidProfileKey,
  suggestBudgetByProfile,
} from '../constants/tripProfiles.js';
import * as tripRepo from '../repositories/trip.repository.js';

function parseMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function assertDates(startDate, endDate) {
  const s = new Date(`${startDate}T12:00:00Z`);
  const e = new Date(`${endDate}T12:00:00Z`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    const err = new Error('Datas inválidas.');
    err.status = 400;
    throw err;
  }
  if (e < s) {
    const err = new Error('A data final deve ser maior ou igual à inicial.');
    err.status = 400;
    throw err;
  }
}

/**
 * @param {object} input
 * @param {string} input.userId
 */
export async function createTrip(input) {
  const {
    userId,
    destination,
    startDate,
    endDate,
    totalBudget,
    profile,
    categoryAmounts,
  } = input;

  const dest = String(destination || '').trim();
  if (dest.length < 2) {
    const err = new Error('Informe o destino.');
    err.status = 400;
    throw err;
  }
  assertDates(startDate, endDate);

  if (!isValidProfileKey(profile)) {
    const err = new Error(
      'Perfil inválido. Use: urban, beach, international ou backpacker.'
    );
    err.status = 400;
    throw err;
  }

  const total = parseMoney(totalBudget);
  if (total === null || total <= 0) {
    const err = new Error('Orçamento total deve ser um valor positivo.');
    err.status = 400;
    throw err;
  }

  const suggested = suggestBudgetByProfile(profile, total);
  const lines = [];

  if (categoryAmounts && typeof categoryAmounts === 'object') {
    let sum = 0;
    for (const cat of BUDGET_CATEGORIES) {
      if (categoryAmounts[cat] === undefined) {
        const err = new Error(
          `Informe o valor planejado para a categoria: ${cat}.`
        );
        err.status = 400;
        throw err;
      }
      const amt = parseMoney(categoryAmounts[cat]);
      if (amt === null || amt < 0) {
        const err = new Error(`Valor inválido para ${cat}.`);
        err.status = 400;
        throw err;
      }
      sum += amt;
      lines.push({ category: cat, plannedAmount: amt.toFixed(2) });
    }
    const sumRounded = Math.round(sum * 100) / 100;
    if (sumRounded > total) {
      const err = new Error(
        'A soma das categorias não pode ultrapassar o orçamento total.'
      );
      err.status = 400;
      throw err;
    }
  } else {
    for (const cat of BUDGET_CATEGORIES) {
      lines.push({
        category: cat,
        plannedAmount: suggested[cat],
      });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const trip = await tripRepo.insertTrip(client, {
      userId,
      destination: dest,
      startDate,
      endDate,
      totalBudget: total.toFixed(2),
      profile,
    });
    await tripRepo.insertBudgetLines(client, trip.id, lines);
    await client.query('COMMIT');
    return getTripDetail(trip.id, userId);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function listTrips(userId) {
  const rows = await tripRepo.listTripsByUser(userId);
  return rows.map((row) => ({
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    totalBudget: row.total_budget,
    profile: row.profile,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getTripDetail(tripId, userId) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) {
    const err = new Error('Viagem não encontrada.');
    err.status = 404;
    throw err;
  }
  const budgetLines = await tripRepo.getBudgetLines(tripId);
  return formatTrip(trip, budgetLines);
}

function formatTrip(row, budgetLines) {
  return {
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    totalBudget: row.total_budget,
    profile: row.profile,
    budgetLines: budgetLines.map((b) => ({
      category: b.category,
      plannedAmount: b.planned_amount,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
