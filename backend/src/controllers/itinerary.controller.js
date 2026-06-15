import * as itineraryService from '../services/itinerary.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getItinerary = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.getItinerary(
    req.user.id,
    req.params.tripId
  );
  res.json({ itinerary });
});

export const createItem = asyncHandler(async (req, res) => {
  const item = await itineraryService.createItem(
    req.user.id,
    req.params.tripId,
    req.body
  );
  res.status(201).json({ item });
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await itineraryService.updateItem(
    req.user.id,
    req.params.tripId,
    req.params.itemId,
    req.body
  );
  res.json({ item });
});

export const deleteItem = asyncHandler(async (req, res) => {
  await itineraryService.removeItem(
    req.user.id,
    req.params.tripId,
    req.params.itemId
  );
  res.status(204).send();
});
