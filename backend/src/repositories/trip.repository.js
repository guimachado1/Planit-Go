import { pool } from '../config/database.js';

export async function insertTrip(client, data) {
  const {
    userId,
    destination,
    startDate,
    endDate,
    totalBudget,
    profile,
  } = data;
  const { rows } = await client.query(
    `INSERT INTO trips (user_id, destination, start_date, end_date, total_budget, profile)
     VALUES ($1, $2, $3::date, $4::date, $5::numeric, $6::trip_profile)
     RETURNING id, user_id, destination, start_date, end_date, total_budget, profile, created_at, updated_at`,
    [userId, destination, startDate, endDate, totalBudget, profile]
  );
  return rows[0];
}

export async function insertBudgetLines(client, tripId, lines) {
  for (const line of lines) {
    await client.query(
      `INSERT INTO trip_budget_lines (trip_id, category, planned_amount)
       VALUES ($1, $2, $3::numeric)`,
      [tripId, line.category, line.plannedAmount]
    );
  }
}

export async function listTripsByUser(userId) {
  const { rows } = await pool.query(
    `SELECT id, destination, start_date, end_date, total_budget, profile, created_at, updated_at
     FROM trips WHERE user_id = $1 ORDER BY start_date DESC`,
    [userId]
  );
  return rows;
}

export async function getTripForUser(tripId, userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, destination, start_date, end_date, total_budget, profile, created_at, updated_at
     FROM trips WHERE id = $1 AND user_id = $2`,
    [tripId, userId]
  );
  return rows[0] ?? null;
}

export async function getBudgetLines(tripId) {
  const { rows } = await pool.query(
    `SELECT category, planned_amount FROM trip_budget_lines WHERE trip_id = $1 ORDER BY category`,
    [tripId]
  );
  return rows;
}

/** Atualiza apenas o período da viagem (destino não é editável via API). */
export async function updateTripDates(tripId, userId, { startDate, endDate }) {
  const { rows } = await pool.query(
    `UPDATE trips
     SET start_date = $3::date,
         end_date = $4::date,
         updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, destination, start_date, end_date, total_budget, profile, created_at, updated_at`,
    [tripId, userId, startDate, endDate]
  );
  return rows[0] ?? null;
}

export async function deleteTripForUser(tripId, userId) {
  const { rowCount } = await pool.query(
    `DELETE FROM trips WHERE id = $1 AND user_id = $2`,
    [tripId, userId]
  );
  return rowCount > 0;
}

/** Gasto ou item de itinerário fora do novo intervalo impede o ajuste de datas. */
export async function findTripDateConflict(tripId, startDate, endDate) {
  const { rows } = await pool.query(
    `SELECT CASE
       WHEN EXISTS (
         SELECT 1 FROM expenses
         WHERE trip_id = $1 AND (spent_at < $2::date OR spent_at > $3::date)
       ) THEN 'expense'
       WHEN EXISTS (
         SELECT 1 FROM itinerary_items
         WHERE trip_id = $1 AND (day_date < $2::date OR day_date > $3::date)
       ) THEN 'itinerary'
     END AS kind`,
    [tripId, startDate, endDate]
  );
  return rows[0]?.kind ?? null;
}
