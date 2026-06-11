import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRIP_PROFILES,
  BUDGET_CATEGORIES,
  isValidProfileKey,
} from '../src/constants/tripProfiles.js';

test('cada perfil soma 100%', () => {
  for (const p of Object.values(TRIP_PROFILES)) {
    const sum =
      p.transport + p.accommodation + p.food + p.activities;
    assert.equal(sum, 100);
  }
});

test('BUDGET_CATEGORIES contém as quatro categorias RF02', () => {
  assert.deepEqual(BUDGET_CATEGORIES, [
    'transport',
    'accommodation',
    'food',
    'activities',
  ]);
});

test('isValidProfileKey aceita perfis conhecidos', () => {
  for (const key of Object.keys(TRIP_PROFILES)) {
    assert.equal(isValidProfileKey(key), true);
  }
});

test('isValidProfileKey rejeita perfil desconhecido', () => {
  assert.equal(isValidProfileKey('cruise'), false);
});
