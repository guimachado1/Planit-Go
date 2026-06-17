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

export async function getExpenseForTrip(expenseId, tripId) {
  const { rows } = await pool.query(
    `SELECT id, trip_id, category, amount, spent_at, description, created_at
     FROM expenses WHERE id = $1 AND trip_id = $2`,
    [expenseId, tripId]
  );
  return rows[0] ?? null;
}

export async function updateExpense(expenseId, tripId, data) {
  const { rows } = await pool.query(
    `UPDATE expenses
     SET category = $3,
         amount = $4::numeric,
         spent_at = $5::date,
         description = $6
     WHERE id = $1 AND trip_id = $2
     RETURNING id, trip_id, category, amount, spent_at, description, created_at`,
    [
      expenseId,
      tripId,
      data.category,
      data.amount,
      data.spentAt,
      data.description ?? null,
    ]
  );
  return rows[0] ?? null;
}

export async function deleteExpense(expenseId, tripId) {
  const { rowCount } = await pool.query(
    `DELETE FROM expenses WHERE id = $1 AND trip_id = $2`,
    [expenseId, tripId]
  );
  return rowCount > 0;
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
