import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAutomaticDistribution } from '../src/domain/budget/distribution.js';
import { TRIP_PROFILES } from '../src/constants/tripProfiles.js';
import { AppError } from '../src/errors/AppError.js';

test('cada perfil soma 100% nos percentuais', () => {
  for (const p of Object.values(TRIP_PROFILES)) {
    const sum =
      p.transport + p.accommodation + p.food + p.activities;
    assert.equal(sum, 100);
  }
});

test('distribuição automática fecha o orçamento total', () => {
  const total = 5000;
  for (const key of Object.keys(TRIP_PROFILES)) {
    const { lines, byCategory } = calculateAutomaticDistribution(key, total);
    assert.equal(lines.length, 4);
    const sum = Object.values(byCategory).reduce(
      (a, v) => a + Number(v),
      0
    );
    assert.equal(Math.round(sum * 100) / 100, total);
    for (const line of lines) {
      assert.equal(line.source, 'automatic');
    }
  }
});

test('perfil inválido na distribuição lança AppError', () => {
  assert.throws(
    () => calculateAutomaticDistribution('cruise', 1000),
    (err) => err instanceof AppError && err.status === 400
  );
});

test('orçamento inválido na distribuição lança AppError', () => {
  assert.throws(
    () => calculateAutomaticDistribution('urban', -10),
    (err) => err instanceof AppError && err.status === 400
  );
});

test('perfil urban distribui 20% em transporte para 1000', () => {
  const { byCategory } = calculateAutomaticDistribution('urban', 1000);
  assert.equal(byCategory.transport, '200.00');
});
