import '../test-support/setupEnv.js';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  installPoolMock,
  restorePoolMock,
  onPoolQuery,
} from '../test-support/mockPool.js';
import * as expenseService from '../src/services/expense.service.js';

const userId = '550e8400-e29b-41d4-a716-446655440000';
const tripId = '660e8400-e29b-41d4-a716-446655440001';

const tripRow = {
  id: tripId,
  user_id: userId,
  destination: 'Curitiba',
  start_date: '2026-09-01',
  end_date: '2026-09-05',
  total_budget: '1000.00',
  profile: 'urban',
  created_at: new Date(),
  updated_at: new Date(),
};

beforeEach(() => {
  installPoolMock();
});

afterEach(() => {
  restorePoolMock();
});

test('addExpense retorna 404 quando viagem não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () =>
      expenseService.addExpense(userId, tripId, {
        category: 'food',
        amount: 50,
        spentAt: '2026-09-02',
      }),
    (err) => err.status === 404
  );
});

test('addExpense rejeita categoria inválida', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      expenseService.addExpense(userId, tripId, {
        category: 'souvenirs',
        amount: 50,
        spentAt: '2026-09-02',
      }),
    (err) => err.status === 400 && err.message.includes('Categoria')
  );
});

test('addExpense rejeita valor inválido', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      expenseService.addExpense(userId, tripId, {
        category: 'food',
        amount: -10,
        spentAt: '2026-09-02',
      }),
    (err) => err.status === 400 && err.message.includes('Valor')
  );
});

test('addExpense exige data do gasto', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      expenseService.addExpense(userId, tripId, {
        category: 'food',
        amount: 50,
      }),
    (err) => err.status === 400 && err.message.includes('spentAt')
  );
});

test('addExpense rejeita data fora do período da viagem', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      expenseService.addExpense(userId, tripId, {
        category: 'food',
        amount: 50,
        spentAt: '2026-10-01',
      }),
    (err) => err.status === 400 && err.message.includes('período')
  );
});

test('addExpense persiste gasto válido', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('INSERT INTO expenses')) {
      return {
        rows: [
          {
            id: 'exp-1',
            trip_id: tripId,
            category: 'food',
            amount: '50.00',
            spent_at: '2026-09-02',
            description: 'Almoço',
            created_at: new Date(),
          },
        ],
      };
    }
    return { rows: [] };
  });

  const expense = await expenseService.addExpense(userId, tripId, {
    category: 'food',
    amount: 50,
    spentAt: '2026-09-02',
    description: 'Almoço',
  });

  assert.equal(expense.category, 'food');
  assert.equal(expense.amount, '50.00');
});

test('listExpenses retorna 404 quando viagem não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () => expenseService.listExpenses(userId, tripId),
    (err) => err.status === 404
  );
});

test('listExpenses retorna gastos da viagem', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM expenses')) {
      return {
        rows: [
          {
            id: 'exp-1',
            category: 'transport',
            amount: '30.00',
            spent_at: '2026-09-01',
            description: null,
            created_at: new Date(),
          },
        ],
      };
    }
    return { rows: [] };
  });

  const expenses = await expenseService.listExpenses(userId, tripId);
  assert.equal(expenses.length, 1);
  assert.equal(expenses[0].category, 'transport');
});

test('getFinancialSummary monta totais por categoria', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('trip_budget_lines')) {
      return {
        rows: [
          { category: 'transport', planned_amount: '200.00' },
          { category: 'accommodation', planned_amount: '250.00' },
          { category: 'food', planned_amount: '300.00' },
          { category: 'activities', planned_amount: '250.00' },
        ],
      };
    }
    if (sql.includes('GROUP BY category')) {
      return {
        rows: [
          { category: 'food', total: '80.00' },
          { category: 'transport', total: '20.00' },
        ],
      };
    }
    return { rows: [] };
  });

  const summary = await expenseService.getFinancialSummary(userId, tripId);

  assert.equal(summary.tripId, tripId);
  assert.equal(summary.totalBudget, 1000);
  assert.equal(summary.totalSpent, 100);
  assert.equal(summary.totalRemaining, 900);
  assert.equal(summary.byCategory.length, 4);

  const food = summary.byCategory.find((c) => c.category === 'food');
  assert.equal(food.planned, 300);
  assert.equal(food.spent, 80);
  assert.equal(food.remaining, 220);
  assert.equal(food.percentUsed, Math.round((80 / 300) * 1000) / 10);
  assert.equal(food.alertLevel, 'ok');
  assert.equal(summary.alerts.overall.alertLevel, 'ok');
});

test('getFinancialSummary retorna 404 quando viagem não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () => expenseService.getFinancialSummary(userId, tripId),
    (err) => err.status === 404
  );
});

const expenseRow = {
  id: 'exp-1',
  trip_id: tripId,
  category: 'food',
  amount: '50.00',
  spent_at: '2026-09-02',
  description: 'Almoço',
  created_at: new Date(),
};

test('updateExpense atualiza gasto válido', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM expenses WHERE id')) {
      return { rows: [expenseRow] };
    }
    if (sql.includes('UPDATE expenses')) {
      return {
        rows: [{ ...expenseRow, amount: '60.00', description: 'Jantar' }],
      };
    }
    return { rows: [] };
  });

  const expense = await expenseService.updateExpense(userId, tripId, 'exp-1', {
    category: 'food',
    amount: 60,
    spentAt: '2026-09-02',
    description: 'Jantar',
  });

  assert.equal(expense.amount, '60.00');
  assert.equal(expense.description, 'Jantar');
});

test('updateExpense retorna 404 quando gasto não existe', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      expenseService.updateExpense(userId, tripId, 'missing', {
        category: 'food',
        amount: 50,
        spentAt: '2026-09-02',
      }),
    (err) => err.status === 404 && err.message.includes('Gasto')
  );
});

test('deleteExpense remove gasto da viagem', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM expenses WHERE id')) {
      return { rows: [expenseRow] };
    }
    if (sql.includes('DELETE FROM expenses')) {
      return { rowCount: 1 };
    }
    return { rows: [] };
  });

  await assert.doesNotReject(() =>
    expenseService.deleteExpense(userId, tripId, 'exp-1')
  );
});

test('deleteExpense retorna 404 quando gasto não existe', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () => expenseService.deleteExpense(userId, tripId, 'missing'),
    (err) => err.status === 404
  );
});
