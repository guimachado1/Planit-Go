import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eachDayInRange,
  buildItineraryResponse,
  validateItemPayload,
  normalizeStartTime,
  normalizeDateOnly,
} from '../src/domain/itinerary/itineraryHelpers.js';

const trip = {
  id: 'trip-1',
  destination: 'Curitiba',
  start_date: '2026-09-01',
  end_date: '2026-09-03',
};

test('eachDayInRange inclui primeiro e último dia', () => {
  assert.deepEqual(eachDayInRange('2026-09-01', '2026-09-03'), [
    '2026-09-01',
    '2026-09-02',
    '2026-09-03',
  ]);
});

test('eachDayInRange com um único dia', () => {
  assert.deepEqual(eachDayInRange('2026-09-01', '2026-09-01'), ['2026-09-01']);
});

test('normalizeStartTime aceita HH:MM e null', () => {
  assert.equal(normalizeStartTime('14:30'), '14:30:00');
  assert.equal(normalizeStartTime(null), null);
  assert.equal(normalizeStartTime(''), null);
  assert.equal(normalizeStartTime('25:00'), undefined);
});

test('validateItemPayload rejeita data fora da viagem', () => {
  const result = validateItemPayload(
    { dayDate: '2026-09-10', title: 'Passeio' },
    trip
  );
  assert.equal(result.status, 400);
  assert.match(result.error, /período/);
});

test('validateItemPayload rejeita título curto', () => {
  const result = validateItemPayload(
    { dayDate: '2026-09-01', title: 'A' },
    trip
  );
  assert.equal(result.status, 400);
});

test('validateItemPayload aceita payload válido', () => {
  const result = validateItemPayload(
    {
      dayDate: '2026-09-02',
      title: 'Check-in',
      startTime: '15:00',
      description: 'Hotel central',
    },
    trip
  );
  assert.ok(result.data);
  assert.equal(result.data.dayDate, '2026-09-02');
  assert.equal(result.data.title, 'Check-in');
  assert.equal(result.data.startTime, '15:00:00');
});

test('buildItineraryResponse inclui dias vazios', () => {
  const response = buildItineraryResponse(trip, [
    {
      id: 'item-1',
      trip_id: trip.id,
      day_date: '2026-09-02',
      title: 'Museu',
      description: null,
      start_time: '10:00:00',
      sort_order: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  assert.equal(response.days.length, 3);
  assert.equal(response.days[0].items.length, 0);
  assert.equal(response.days[1].items.length, 1);
  assert.equal(response.days[1].items[0].title, 'Museu');
  assert.equal(response.days[2].items.length, 0);
});

test('eachDayInRange aceita objetos Date do PostgreSQL', () => {
  const start = new Date('2026-09-01T00:00:00.000Z');
  const end = new Date('2026-09-03T00:00:00.000Z');
  assert.deepEqual(eachDayInRange(start, end), [
    '2026-09-01',
    '2026-09-02',
    '2026-09-03',
  ]);
});

test('normalizeDateOnly converte Date JS para YYYY-MM-DD', () => {
  assert.equal(
    normalizeDateOnly(new Date('2026-07-15T00:00:00.000Z')),
    '2026-07-15'
  );
});

test('eachDayInRange rejeita datas inválidas', () => {
  assert.throws(
    () => eachDayInRange('invalid', '2026-09-05'),
    (err) => err.status === 400
  );
});
