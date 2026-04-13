import * as expenseService from '../services/expense.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const expense = await expenseService.addExpense(
    req.user.id,
    req.params.tripId,
    req.body
  );
  res.status(201).json({ expense });
});

export const list = asyncHandler(async (req, res) => {
  const expenses = await expenseService.listExpenses(
    req.user.id,
    req.params.tripId
  );
  res.json({ expenses });
});

export const summary = asyncHandler(async (req, res) => {
  const summary = await expenseService.getFinancialSummary(
    req.user.id,
    req.params.tripId
  );
  res.json({ summary });
});
