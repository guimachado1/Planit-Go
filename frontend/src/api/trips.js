import client from './client.js';

/** POST /api/trips/budget/suggest */
export async function suggestBudget({ profile, totalBudget }) {
  const { data } = await client.post('/api/trips/budget/suggest', {
    profile,
    totalBudget,
  });
  return data;
}

/** POST /api/trips/budget/preview */
export async function previewBudget({ profile, totalBudget, categoryAmounts }) {
  const { data } = await client.post('/api/trips/budget/preview', {
    profile,
    totalBudget,
    categoryAmounts,
  });
  return data;
}

/** POST /api/trips */
export async function createTrip(payload) {
  const { data } = await client.post('/api/trips', payload);
  return data.trip;
}

export async function listTrips() {
  const { data } = await client.get('/api/trips');
  return data.trips;
}

export async function getTrip(id) {
  const { data } = await client.get(`/api/trips/${id}`);
  return data.trip;
}

/** PATCH /api/trips/:id */
export async function updateTrip(id, payload) {
  const { data } = await client.patch(`/api/trips/${id}`, payload);
  return data.trip;
}

/** DELETE /api/trips/:id */
export async function deleteTrip(id) {
  await client.delete(`/api/trips/${id}`);
}
