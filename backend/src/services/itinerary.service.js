import {
  buildItineraryResponse,
  mapItineraryItem,
  validateItemPayload,
} from '../domain/itinerary/itineraryHelpers.js';
import * as itineraryRepo from '../repositories/itinerary.repository.js';
import * as tripRepo from '../repositories/trip.repository.js';

function notFoundTrip() {
  const err = new Error('Viagem não encontrada.');
  err.status = 404;
  return err;
}

function notFoundItem() {
  const err = new Error('Atividade não encontrada.');
  err.status = 404;
  return err;
}

async function requireTrip(userId, tripId) {
  const trip = await tripRepo.getTripForUser(tripId, userId);
  if (!trip) throw notFoundTrip();
  return trip;
}

export async function getItinerary(userId, tripId) {
  const trip = await requireTrip(userId, tripId);
  const rows = await itineraryRepo.listItemsByTrip(tripId);
  const items = rows.map(mapItineraryItem);
  return buildItineraryResponse(trip, items);
}

export async function createItem(userId, tripId, body) {
  const trip = await requireTrip(userId, tripId);
  const validated = validateItemPayload(body, trip);
  if (validated.error) {
    const err = new Error(validated.error);
    err.status = validated.status;
    throw err;
  }

  const sortOrder = await itineraryRepo.getNextSortOrder(
    tripId,
    validated.data.dayDate
  );
  const row = await itineraryRepo.insertItem({
    tripId,
    ...validated.data,
    sortOrder,
  });
  return mapItineraryItem(row);
}

export async function updateItem(userId, tripId, itemId, body) {
  const trip = await requireTrip(userId, tripId);
  const existing = await itineraryRepo.getItemForTrip(itemId, tripId);
  if (!existing) throw notFoundItem();

  const validated = validateItemPayload(body, trip);
  if (validated.error) {
    const err = new Error(validated.error);
    err.status = validated.status;
    throw err;
  }

  const row = await itineraryRepo.updateItem(itemId, tripId, validated.data);
  if (!row) throw notFoundItem();
  return mapItineraryItem(row);
}

export async function removeItem(userId, tripId, itemId) {
  await requireTrip(userId, tripId);
  const existing = await itineraryRepo.getItemForTrip(itemId, tripId);
  if (!existing) throw notFoundItem();
  await itineraryRepo.deleteItem(itemId, tripId);
}
