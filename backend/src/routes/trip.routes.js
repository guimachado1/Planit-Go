import { Router } from 'express';
import * as tripController from '../controllers/trip.controller.js';
import * as expenseController from '../controllers/expense.controller.js';
import * as itineraryController from '../controllers/itinerary.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const r = Router();

r.use(authMiddleware);

r.post('/budget/suggest', tripController.suggestBudget);
r.post('/budget/preview', tripController.previewBudget);
r.post('/', tripController.create);
r.get('/', tripController.list);

r.post('/:tripId/expenses', expenseController.create);
r.get('/:tripId/expenses', expenseController.list);
r.get('/:tripId/summary', expenseController.summary);

r.get('/:tripId/itinerary', itineraryController.getItinerary);
r.post('/:tripId/itinerary/items', itineraryController.createItem);
r.patch('/:tripId/itinerary/items/:itemId', itineraryController.updateItem);
r.delete('/:tripId/itinerary/items/:itemId', itineraryController.deleteItem);

r.patch('/:id', tripController.update);
r.delete('/:id', tripController.remove);
r.get('/:id', tripController.getOne);

export default r;
