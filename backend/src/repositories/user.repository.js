import { pool } from '../config/database.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, full_name, created_at
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, full_name, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createUser({ email, passwordHash, fullName }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, created_at`,
    [email.toLowerCase(), passwordHash, fullName]
  );
  return rows[0];
}
