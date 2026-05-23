import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCreateTripPayload } from '../src/domain/trip/tripValidation.js';

test('validateCreateTripPayload não inclui userId no retorno', () => {
  const result = validateCreateTripPayload({
    userId: '550e8400-e29b-41d4-a716-446655440000',
    destination: 'Curitiba',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    totalBudget: 1000,
    profile: 'urban',
  });
  assert.equal(result.userId, undefined);
  assert.equal(result.destination, 'Curitiba');
});
