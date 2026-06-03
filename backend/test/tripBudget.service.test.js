import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  previewBudget,
  suggestBudget,
} from '../src/services/tripBudget.service.js';

test('suggestBudget retorna percentuais e sugestão', () => {
  const result = suggestBudget({ profile: 'backpacker', totalBudget: 2000 });
  assert.equal(result.profile, 'backpacker');
  assert.equal(result.percentages.transport, 35);
  assert.equal(result.suggested.transport, '700.00');
  assert.equal(result.summary.totalBudget, '2000.00');
});

test('previewBudget valida ajuste manual', () => {
  const result = previewBudget({
    profile: 'urban',
    totalBudget: 1000,
    categoryAmounts: {
      transport: 250,
      accommodation: 250,
      food: 250,
      activities: 250,
    },
  });
  assert.equal(result.distributionMode, 'manual');
  assert.equal(result.summary.allocatedTotal, '1000.00');
});
