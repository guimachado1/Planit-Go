import { pool } from '../config/database.js';
import { TRIP_PROFILES } from '../constants/tripProfiles.js';
import { buildBudgetSummary } from '../domain/trip/budgetSummary.js';
import { resolveTripStatus } from '../domain/trip/tripStatus.js';
import { validateCreateTripPayload, validateUpdateTripPayload } from '../domain/trip/tripValidation.js';
import { AppError } from '../errors/AppError.js';
import * as tripRepo from '../repositories/trip.repository.js';

/**
 * @param {object} input
 * @param {string} input.userId
 */
export async function createTrip(input) {
  const userId = input.userId;
  if (!userId) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  const validated = validateCreateTripPayload(input);
  const { destination, startDate, endDate, profile, totalBudget, lines } =
    validated;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const trip = await tripRepo.insertTrip(client, {
      userId,
      destination,
      startDate,
      endDate,
      totalBudget: totalBudget.toFixed(2),
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
  return rows.map((row) => formatTripListItem(row));
}

function formatTripListItem(row) {
  const { status, label: statusLabel } = resolveTripStatus(
    row.start_date,
    row.end_date
  );
  return {
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    totalBudget: row.total_budget,
    profile: row.profile,
    profileLabel: TRIP_PROFILES[row.profile]?.label ?? row.profile,
    status,
    statusLabel,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTripDetail(tripId, userId) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) {
    throw new AppError('Viagem não encontrada.', 404);
  }
  const budgetLines = await tripRepo.getBudgetLines(tripId);
  return formatTrip(trip, budgetLines);
}

export async function updateTrip(tripId, userId, input) {
  if (!userId) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  const existing = await tripRepo.getTripForUser(tripId, userId);
  if (!existing) {
    throw new AppError('Viagem não encontrada.', 404);
  }

  const { startDate, endDate } = validateUpdateTripPayload(input);

  const conflict = await tripRepo.findTripDateConflict(
    tripId,
    startDate,
    endDate
  );
  if (conflict === 'expense') {
    throw new AppError(
      'Não é possível alterar as datas: existem gastos fora do novo período. Ajuste ou remova esses lançamentos primeiro.',
      400
    );
  }
  if (conflict === 'itinerary') {
    throw new AppError(
      'Não é possível alterar as datas: existem atividades do itinerário fora do novo período.',
      400
    );
  }

  const updated = await tripRepo.updateTripDates(tripId, userId, {
    startDate,
    endDate,
  });
  if (!updated) {
    throw new AppError('Viagem não encontrada.', 404);
  }

  return getTripDetail(tripId, userId);
}

export async function deleteTrip(tripId, userId) {
  if (!userId) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  const deleted = await tripRepo.deleteTripForUser(tripId, userId);
  if (!deleted) {
    throw new AppError('Viagem não encontrada.', 404);
  }
}

function formatTrip(row, budgetLines) {
  const lines = budgetLines.map((b) => ({
    category: b.category,
    plannedAmount: b.planned_amount,
  }));
  const profileMeta = TRIP_PROFILES[row.profile];
  const { status, label: statusLabel } = resolveTripStatus(
    row.start_date,
    row.end_date
  );

  return {
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    totalBudget: row.total_budget,
    profile: row.profile,
    profileLabel: profileMeta?.label ?? row.profile,
    status,
    statusLabel,
    budgetLines: lines,
    budget: {
      lines,
      summary: buildBudgetSummary(row.total_budget, lines),
      percentages: profileMeta
        ? {
            transport: profileMeta.transport,
            accommodation: profileMeta.accommodation,
            food: profileMeta.food,
            activities: profileMeta.activities,
          }
        : null,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
