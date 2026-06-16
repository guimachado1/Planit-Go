import '../test-support/setupEnv.js';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { AppError } from '../src/errors/AppError.js';
import {
  createMockClient,
  installPoolMock,
  onPoolConnect,
  onPoolQuery,
  restorePoolMock,
} from '../test-support/mockPool.js';
import * as tripService from '../src/services/trip.service.js';

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
  created_at: new Date('2026-01-01'),
  updated_at: new Date('2026-01-01'),
};

const budgetLines = [
  { category: 'transport', planned_amount: '200.00' },
  { category: 'accommodation', planned_amount: '250.00' },
  { category: 'food', planned_amount: '300.00' },
  { category: 'activities', planned_amount: '250.00' },
];

function mockTripQueries() {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('trip_budget_lines')) {
      return { rows: budgetLines };
    }
    if (sql.includes('FROM trips WHERE user_id')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });
}

beforeEach(() => {
  installPoolMock();
});

afterEach(() => {
  restorePoolMock();
});

test('createTrip exige userId autenticado', async () => {
  await assert.rejects(
    () =>
      tripService.createTrip({
        destination: 'Curitiba',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        totalBudget: 1000,
        profile: 'urban',
      }),
    (err) => err instanceof AppError && err.status === 401
  );
});

test('createTrip persiste viagem e retorna detalhe', async () => {
  onPoolConnect(() =>
    createMockClient((sql) => {
      if (sql === 'BEGIN' || sql === 'COMMIT') {
        return { rows: [] };
      }
      if (sql.includes('INSERT INTO trips')) {
        return { rows: [tripRow] };
      }
      if (sql.includes('INSERT INTO trip_budget_lines')) {
        return { rows: [] };
      }
      return { rows: [] };
    })
  );
  mockTripQueries();

  const trip = await tripService.createTrip({
    userId,
    destination: 'Curitiba',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    totalBudget: 1000,
    profile: 'urban',
  });

  assert.equal(trip.id, tripId);
  assert.equal(trip.destination, 'Curitiba');
  assert.equal(trip.budgetLines.length, 4);
  assert.equal(trip.budget.summary.allocatedTotal, '1000.00');
});

test('createTrip faz rollback em caso de erro', async () => {
  const client = createMockClient((sql) => {
    if (sql === 'BEGIN') {
      return { rows: [] };
    }
    if (sql.includes('INSERT INTO trips')) {
      throw new Error('falha no insert');
    }
    if (sql === 'ROLLBACK') {
      return { rows: [] };
    }
    return { rows: [] };
  });

  onPoolConnect(() => client);

  await assert.rejects(
    () =>
      tripService.createTrip({
        userId,
        destination: 'Curitiba',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        totalBudget: 1000,
        profile: 'urban',
      }),
    (err) => err.message === 'falha no insert'
  );

  assert.ok(client.queries.some((q) => q.sql === 'ROLLBACK'));
});

test('listTrips retorna viagens do usuário', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('ORDER BY start_date')) {
      return { rows: [tripRow] };
    }
    return { rows: [] };
  });

  const trips = await tripService.listTrips(userId);
  assert.equal(trips.length, 1);
  assert.equal(trips[0].destination, 'Curitiba');
  assert.equal(trips[0].profileLabel, 'Urbana / Cidade grande');
  assert.equal(trips[0].status, 'planned');
  assert.equal(trips[0].statusLabel, 'Planejada');
});

test('getTripDetail retorna 404 quando viagem não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () => tripService.getTripDetail(tripId, userId),
    (err) => err instanceof AppError && err.status === 404
  );
});

test('getTripDetail retorna viagem formatada', async () => {
  mockTripQueries();

  const trip = await tripService.getTripDetail(tripId, userId);
  assert.equal(trip.profile, 'urban');
  assert.equal(trip.status, 'planned');
  assert.equal(trip.statusLabel, 'Planejada');
  assert.equal(trip.budget.percentages.transport, 20);
  assert.equal(trip.budget.summary.totalBudget, '1000.00');
});

test('updateTrip atualiza datas da viagem', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE id') && sql.includes('user_id')) {
      return {
        rows: [{ ...tripRow, end_date: '2026-09-10' }],
      };
    }
    if (sql.includes('UNION ALL')) {
      return { rows: [] };
    }
    if (sql.includes('UPDATE trips')) {
      return {
        rows: [{ ...tripRow, end_date: '2026-09-10' }],
      };
    }
    if (sql.includes('trip_budget_lines')) {
      return { rows: budgetLines };
    }
    return { rows: [] };
  });

  const trip = await tripService.updateTrip(tripId, userId, {
    startDate: '2026-09-01',
    endDate: '2026-09-10',
  });
  assert.equal(trip.destination, 'Curitiba');
  assert.equal(trip.endDate, '2026-09-10');
});

test('updateTrip bloqueia datas com gastos fora do período', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips WHERE')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('UNION ALL')) {
      return { rows: [{ kind: 'expense' }] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      tripService.updateTrip(tripId, userId, {
        startDate: '2026-10-01',
        endDate: '2026-10-05',
      }),
    (err) =>
      err instanceof AppError && err.status === 400 && err.message.includes('gastos')
  );
});

test('deleteTrip remove viagem do usuário', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('DELETE FROM trips')) {
      return { rowCount: 1 };
    }
    return { rows: [] };
  });

  await assert.doesNotReject(() => tripService.deleteTrip(tripId, userId));
});

test('deleteTrip retorna 404 quando viagem não existe', async () => {
  onPoolQuery(() => ({ rowCount: 0 }));

  await assert.rejects(
    () => tripService.deleteTrip(tripId, userId),
    (err) => err instanceof AppError && err.status === 404
  );
});
