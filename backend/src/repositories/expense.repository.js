import { pool } from '../config/database.js';

export async function insertExpense(data) {
  const { tripId, category, amount, spentAt, description } = data;
  const { rows } = await pool.query(
    `INSERT INTO expenses (trip_id, category, amount, spent_at, description)
     VALUES ($1, $2, $3::numeric, $4::date, $5)
     RETURNING id, trip_id, category, amount, spent_at, description, created_at`,
    [tripId, category, amount, spentAt, description ?? null]
  );
  return rows[0];
}

export async function listExpensesByTrip(tripId) {
  const { rows } = await pool.query(
    `SELECT id, category, amount, spent_at, description, created_at
     FROM expenses WHERE trip_id = $1 ORDER BY spent_at DESC, created_at DESC`,
    [tripId]
  );
  return rows;
}

export async function sumExpensesByCategory(tripId) {
  const { rows } = await pool.query(
    `SELECT category, COALESCE(SUM(amount), 0)::numeric AS total
     FROM expenses WHERE trip_id = $1
     GROUP BY category`,
    [tripId]
  );
  return rows;
}
