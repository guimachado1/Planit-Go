import '../test-support/setupEnv.js';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  installPoolMock,
  restorePoolMock,
  onPoolQuery,
} from '../test-support/mockPool.js';
import * as itineraryService from '../src/services/itinerary.service.js';

const userId = '550e8400-e29b-41d4-a716-446655440000';
const tripId = '660e8400-e29b-41d4-a716-446655440001';

const tripRow = {
  id: tripId,
  user_id: userId,
  destination: 'Curitiba',
  start_date: '2026-09-01',
  end_date: '2026-09-03',
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

test('getItinerary retorna 404 quando viagem não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () => itineraryService.getItinerary(userId, tripId),
    (err) => err.status === 404
  );
});

test('getItinerary agrupa dias da viagem', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM itinerary_items')) {
      return {
        rows: [
          {
            id: 'item-1',
            trip_id: tripId,
            day_date: '2026-09-02',
            title: 'Centro histórico',
            description: null,
            start_time: '09:00:00',
            sort_order: 0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };
    }
    return { rows: [] };
  });

  const itinerary = await itineraryService.getItinerary(userId, tripId);
  assert.equal(itinerary.days.length, 3);
  assert.equal(itinerary.days[1].items[0].title, 'Centro histórico');
});

test('createItem persiste atividade válida', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('MAX(sort_order)')) {
      return { rows: [{ next_order: '0' }] };
    }
    if (sql.includes('INSERT INTO itinerary_items')) {
      return {
        rows: [
          {
            id: 'item-new',
            trip_id: tripId,
            day_date: '2026-09-01',
            title: 'Chegada',
            description: null,
            start_time: '14:00:00',
            sort_order: 0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };
    }
    return { rows: [] };
  });

  const item = await itineraryService.createItem(userId, tripId, {
    dayDate: '2026-09-01',
    title: 'Chegada',
    startTime: '14:00',
  });

  assert.equal(item.title, 'Chegada');
  assert.equal(item.startTime, '14:00');
});

test('updateItem retorna 404 quando item não existe', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM itinerary_items WHERE id')) {
      return { rows: [] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      itineraryService.updateItem(userId, tripId, 'missing', {
        dayDate: '2026-09-01',
        title: 'Teste',
      }),
    (err) => err.status === 404
  );
});

test('removeItem exige item existente', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM trips')) {
      return { rows: [tripRow] };
    }
    if (sql.includes('FROM itinerary_items WHERE id')) {
      return { rows: [] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () => itineraryService.removeItem(userId, tripId, 'missing'),
    (err) => err.status === 404
  );
});
