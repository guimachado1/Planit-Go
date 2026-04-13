import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  suggestBudgetByProfile,
  TRIP_PROFILES,
} from '../src/constants/tripProfiles.js';

test('cada perfil soma 100%', () => {
  for (const p of Object.values(TRIP_PROFILES)) {
    const sum =
      p.transport + p.accommodation + p.food + p.activities;
    assert.equal(sum, 100);
  }
});

test('sugestão de orçamento soma o total (centavos)', () => {
  const total = 1000;
  for (const key of Object.keys(TRIP_PROFILES)) {
    const s = suggestBudgetByProfile(key, total);
    const sum = Object.values(s).reduce(
      (a, v) => a + Number(v),
      0
    );
    assert.equal(Math.round(sum * 100) / 100, total);
  }
});
