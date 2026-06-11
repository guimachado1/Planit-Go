import * as tripService from '../services/trip.service.js';
import * as tripBudgetService from '../services/tripBudget.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const suggestBudget = asyncHandler(async (req, res) => {
  const result = tripBudgetService.suggestBudget(req.body);
  res.json(result);
});

export const previewBudget = asyncHandler(async (req, res) => {
  const result = tripBudgetService.previewBudget(req.body);
  res.json(result);
});

export const create = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip({
    userId: req.user.id,
    ...req.body,
  });
  res.status(201).json({ trip });
});

export const list = asyncHandler(async (req, res) => {
  const trips = await tripService.listTrips(req.user.id);
  res.json({ trips });
});

export const getOne = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripDetail(req.params.id, req.user.id);
  res.json({ trip });
});
