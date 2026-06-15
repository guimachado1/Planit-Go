import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRIP_STATUS,
  resolveTripStatus,
} from '../src/domain/trip/tripStatus.js';

const ref = new Date('2026-06-15T12:00:00');

test('resolveTripStatus: antes do início → planned', () => {
  const result = resolveTripStatus('2026-07-01', '2026-07-10', ref);
  assert.equal(result.status, TRIP_STATUS.PLANNED);
  assert.equal(result.label, 'Planejada');
});

test('resolveTripStatus: no primeiro dia → in_progress', () => {
  const result = resolveTripStatus('2026-06-15', '2026-06-20', ref);
  assert.equal(result.status, TRIP_STATUS.IN_PROGRESS);
  assert.equal(result.label, 'Em andamento');
});

test('resolveTripStatus: durante o período → in_progress', () => {
  const result = resolveTripStatus('2026-06-01', '2026-06-30', ref);
  assert.equal(result.status, TRIP_STATUS.IN_PROGRESS);
  assert.equal(result.label, 'Em andamento');
});

test('resolveTripStatus: no último dia → in_progress', () => {
  const result = resolveTripStatus('2026-06-10', '2026-06-15', ref);
  assert.equal(result.status, TRIP_STATUS.IN_PROGRESS);
});

test('resolveTripStatus: após o fim → completed', () => {
  const result = resolveTripStatus('2026-01-01', '2026-01-10', ref);
  assert.equal(result.status, TRIP_STATUS.COMPLETED);
  assert.equal(result.label, 'Finalizada');
});

test('resolveTripStatus: aceita Date do Postgres', () => {
  const start = new Date('2026-06-01T00:00:00.000Z');
  const end = new Date('2026-06-30T00:00:00.000Z');
  const result = resolveTripStatus(start, end, ref);
  assert.equal(result.status, TRIP_STATUS.IN_PROGRESS);
});
