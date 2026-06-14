import { describe, expect, it } from 'vitest';
import { isOverBudget, percentUsed } from './financial.js';

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
