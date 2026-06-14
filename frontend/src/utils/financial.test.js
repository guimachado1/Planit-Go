import { describe, expect, it } from 'vitest';
import {
  budgetAlertForAmounts,
  getActiveBudgetAlerts,
  getBudgetAlertLabel,
  isOverBudget,
  percentUsed,
  resolveBudgetAlertLevel,
} from './financial.js';

describe('percentUsed', () => {
  it('calcula percentual do planejado', () => {
    expect(percentUsed(250, 1000)).toBe(25);
    expect(percentUsed(1000, 1000)).toBe(100);
  });

  it('retorna null se planejado inválido', () => {
    expect(percentUsed(100, 0)).toBeNull();
  });
});

describe('isOverBudget', () => {
  it('detecta estouro', () => {
    expect(isOverBudget(150, 100)).toBe(true);
    expect(isOverBudget(50, 100)).toBe(false);
  });
});

describe('resolveBudgetAlertLevel (RF06)', () => {
  it('classifica faixas 80% e 100%', () => {
    expect(resolveBudgetAlertLevel(50)).toBe('ok');
    expect(resolveBudgetAlertLevel(85)).toBe('warning');
    expect(resolveBudgetAlertLevel(100)).toBe('warning');
    expect(resolveBudgetAlertLevel(110)).toBe('over');
  });
});

describe('budgetAlertForAmounts', () => {
  it('exemplo alimentação 85%', () => {
    const alert = budgetAlertForAmounts(170, 200);
    expect(alert.percentUsed).toBe(85);
    expect(alert.alertLevel).toBe('warning');
    expect(alert.alertLabel).toBe('Atenção');
  });

  it('exemplo transporte 110%', () => {
    const alert = budgetAlertForAmounts(110, 100);
    expect(alert.alertLevel).toBe('over');
    expect(alert.alertLabel).toBe('Orçamento ultrapassado');
  });

  it('exemplo hospedagem 50%', () => {
    const alert = budgetAlertForAmounts(200, 400);
    expect(alert.alertLevel).toBe('ok');
    expect(getBudgetAlertLabel('ok')).toBe('Dentro do limite');
  });
});

describe('getActiveBudgetAlerts', () => {
  it('filtra categorias em atenção ou estouro', () => {
    const active = getActiveBudgetAlerts({
      byCategory: [
        { category: 'food', planned: 200, spent: 170 },
        { category: 'transport', planned: 100, spent: 50 },
      ],
    });
    expect(active).toHaveLength(1);
    expect(active[0].category).toBe('food');
  });
});
