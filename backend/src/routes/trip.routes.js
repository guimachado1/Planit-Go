import { Router } from 'express';
import * as tripController from '../controllers/trip.controller.js';
import * as expenseController from '../controllers/expense.controller.js';
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

r.get('/:id', tripController.getOne);

export default r;
