import { pool } from '../config/database.js';

export async function listItemsByTrip(tripId) {
  const { rows } = await pool.query(
    `SELECT id, trip_id, day_date, title, description, start_time, sort_order, created_at, updated_at
     FROM itinerary_items
     WHERE trip_id = $1
     ORDER BY day_date ASC, sort_order ASC, start_time ASC NULLS LAST, created_at ASC`,
    [tripId]
  );
  return rows;
}

export async function getNextSortOrder(tripId, dayDate) {
  const { rows } = await pool.query(
    `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
     FROM itinerary_items WHERE trip_id = $1 AND day_date = $2::date`,
    [tripId, dayDate]
  );
  return Number(rows[0].next_order);
}

export async function insertItem(data) {
  const { tripId, dayDate, title, description, startTime, sortOrder } = data;
  const { rows } = await pool.query(
    `INSERT INTO itinerary_items (trip_id, day_date, title, description, start_time, sort_order)
     VALUES ($1, $2::date, $3, $4, $5::time, $6)
     RETURNING id, trip_id, day_date, title, description, start_time, sort_order, created_at, updated_at`,
    [tripId, dayDate, title, description ?? null, startTime ?? null, sortOrder]
  );
  return rows[0];
}

export async function getItemForTrip(itemId, tripId) {
  const { rows } = await pool.query(
    `SELECT id, trip_id, day_date, title, description, start_time, sort_order, created_at, updated_at
     FROM itinerary_items WHERE id = $1 AND trip_id = $2`,
    [itemId, tripId]
  );
  return rows[0] ?? null;
}

export async function updateItem(itemId, tripId, data) {
  const { dayDate, title, description, startTime } = data;
  const { rows } = await pool.query(
    `UPDATE itinerary_items
     SET day_date = $3::date,
         title = $4,
         description = $5,
         start_time = $6::time,
         updated_at = NOW()
     WHERE id = $1 AND trip_id = $2
     RETURNING id, trip_id, day_date, title, description, start_time, sort_order, created_at, updated_at`,
    [itemId, tripId, dayDate, title, description ?? null, startTime ?? null]
  );
  return rows[0] ?? null;
}

export async function deleteItem(itemId, tripId) {
  const { rowCount } = await pool.query(
    `DELETE FROM itinerary_items WHERE id = $1 AND trip_id = $2`,
    [itemId, tripId]
  );
  return rowCount > 0;
}
