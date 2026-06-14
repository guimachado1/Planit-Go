import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BUDGET_ALERT_WARNING_PERCENT,
  buildBudgetAlertSummary,
  enrichCategoryWithAlert,
  getBudgetAlertLabel,
  resolveBudgetAlertLevel,
} from '../src/domain/budget/budgetAlerts.js';

test('resolveBudgetAlertLevel abaixo de 80% é ok', () => {
  assert.equal(resolveBudgetAlertLevel(50), 'ok');
  assert.equal(resolveBudgetAlertLevel(79.9), 'ok');
});

test('resolveBudgetAlertLevel entre 80% e 100% é warning', () => {
  assert.equal(resolveBudgetAlertLevel(80), 'warning');
  assert.equal(resolveBudgetAlertLevel(85), 'warning');
  assert.equal(resolveBudgetAlertLevel(100), 'warning');
});

test('resolveBudgetAlertLevel acima de 100% é over', () => {
  assert.equal(resolveBudgetAlertLevel(100.1), 'over');
  assert.equal(resolveBudgetAlertLevel(110), 'over');
});

test('getBudgetAlertLabel retorna textos RF06', () => {
  assert.equal(getBudgetAlertLabel('ok'), 'Dentro do limite');
  assert.equal(getBudgetAlertLabel('warning'), 'Atenção');
  assert.equal(getBudgetAlertLabel('over'), 'Orçamento ultrapassado');
});

test('enrichCategoryWithAlert calcula percentual e nível', () => {
  const row = enrichCategoryWithAlert({
    category: 'food',
    planned: 200,
    spent: 170,
    remaining: 30,
  });
  assert.equal(row.percentUsed, 85);
  assert.equal(row.alertLevel, 'warning');
  assert.equal(row.alertLabel, 'Atenção');
});

test('buildBudgetAlertSummary lista alertas ativos', () => {
  const { byCategory, alerts } = buildBudgetAlertSummary(
    [
      { category: 'food', planned: 200, spent: 170, remaining: 30 },
      { category: 'transport', planned: 100, spent: 110, remaining: -10 },
      { category: 'accommodation', planned: 400, spent: 200, remaining: 200 },
    ],
    1000,
    480
  );

  assert.equal(byCategory.length, 3);
  assert.equal(alerts.active.length, 2);
  assert.equal(alerts.active[0].category, 'food');
  assert.equal(alerts.active[1].alertLevel, 'over');
  assert.equal(BUDGET_ALERT_WARNING_PERCENT, 80);
});
