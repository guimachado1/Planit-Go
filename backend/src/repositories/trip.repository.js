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
