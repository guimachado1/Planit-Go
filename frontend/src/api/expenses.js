import client from './client.js';

function normalizeExpense(row) {
  return {
    id: row.id,
    tripId: row.trip_id ?? row.tripId,
    category: row.category,
    amount: row.amount,
    spentAt: row.spent_at ?? row.spentAt,
    description: row.description,
    createdAt: row.created_at ?? row.createdAt,
  };
}

/** GET /api/trips/:tripId/expenses */
export async function listExpenses(tripId) {
  const { data } = await client.get(`/api/trips/${tripId}/expenses`);
  return (data.expenses ?? []).map(normalizeExpense);
}

/** POST /api/trips/:tripId/expenses */
export async function createExpense(tripId, payload) {
  const { data } = await client.post(`/api/trips/${tripId}/expenses`, {
    category: payload.category,
    amount: payload.amount,
    spentAt: payload.spentAt,
    description: payload.description || undefined,
  });
  return normalizeExpense(data.expense);
}

/** PATCH /api/trips/:tripId/expenses/:expenseId */
export async function updateExpense(tripId, expenseId, payload) {
  const { data } = await client.patch(
    `/api/trips/${tripId}/expenses/${expenseId}`,
    {
      category: payload.category,
      amount: payload.amount,
      spentAt: payload.spentAt,
      description: payload.description || undefined,
    }
  );
  return normalizeExpense(data.expense);
}

/** DELETE /api/trips/:tripId/expenses/:expenseId */
export async function deleteExpense(tripId, expenseId) {
  await client.delete(`/api/trips/${tripId}/expenses/${expenseId}`);
}

/** GET /api/trips/:tripId/summary */
export async function getFinancialSummary(tripId) {
  const { data } = await client.get(`/api/trips/${tripId}/summary`);
  return data.summary;
}
