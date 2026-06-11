import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentUsed, isOverBudget } from '../src/utils/financial.js';

test('percentUsed calcula percentual do planejado', () => {
  assert.equal(percentUsed(250, 1000), 25);
  assert.equal(percentUsed(1000, 1000), 100);
});

test('percentUsed retorna null se planejado inválido', () => {
  assert.equal(percentUsed(100, 0), null);
});

test('isOverBudget detecta estouro', () => {
  assert.equal(isOverBudget(150, 100), true);
  assert.equal(isOverBudget(50, 100), false);
});
