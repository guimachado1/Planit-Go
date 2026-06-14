import client from './client.js';

function normalizeItem(row) {
  return {
    id: row.id,
    tripId: row.trip_id ?? row.tripId,
    dayDate: row.day_date ?? row.dayDate,
    title: row.title,
    description: row.description,
    startTime: row.start_time ?? row.startTime,
    sortOrder: row.sort_order ?? row.sortOrder,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

/** GET /api/trips/:tripId/itinerary */
export async function getItinerary(tripId) {
  const { data } = await client.get(`/api/trips/${tripId}/itinerary`);
  return data.itinerary;
}

/** POST /api/trips/:tripId/itinerary/items */
export async function createItineraryItem(tripId, payload) {
  const { data } = await client.post(`/api/trips/${tripId}/itinerary/items`, {
    dayDate: payload.dayDate,
    title: payload.title,
    startTime: payload.startTime || undefined,
    description: payload.description || undefined,
  });
  return normalizeItem(data.item);
}

/** PATCH /api/trips/:tripId/itinerary/items/:itemId */
export async function updateItineraryItem(tripId, itemId, payload) {
  const { data } = await client.patch(
    `/api/trips/${tripId}/itinerary/items/${itemId}`,
    {
      dayDate: payload.dayDate,
      title: payload.title,
      startTime: payload.startTime ?? null,
      description: payload.description ?? null,
    }
  );
  return normalizeItem(data.item);
}

/** DELETE /api/trips/:tripId/itinerary/items/:itemId */
export async function deleteItineraryItem(tripId, itemId) {
  await client.delete(`/api/trips/${tripId}/itinerary/items/${itemId}`);
}
