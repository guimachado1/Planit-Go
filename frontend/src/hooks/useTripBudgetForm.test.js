import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  amountsFromSuggestion,
  toCategoryAmounts,
  useTripBudgetTotals,
} from './useTripBudgetForm.js';

describe('useTripBudgetTotals', () => {
  it('calcula alocado e saldo não alocado', () => {
    const { result } = renderHook(() =>
      useTripBudgetTotals(
        { transport: 200, accommodation: 200, food: 200, activities: 200 },
        1000
      )
    );

    expect(result.current.allocated).toBe(800);
    expect(result.current.unallocated).toBe(200);
    expect(result.current.isOverBudget).toBe(false);
  });

  it('detecta orçamento ultrapassado', () => {
    const { result } = renderHook(() =>
      useTripBudgetTotals(
        { transport: 500, accommodation: 500, food: 500, activities: 500 },
        1000
      )
    );

    expect(result.current.isOverBudget).toBe(true);
    expect(result.current.unallocated).toBe(-1000);
  });
});

describe('toCategoryAmounts', () => {
  it('normaliza números por categoria', () => {
    expect(
      toCategoryAmounts({
        transport: '100',
        accommodation: 0,
        food: null,
        activities: 50,
      })
    ).toEqual({
      transport: 100,
      accommodation: 0,
      food: 0,
      activities: 50,
    });
  });
});

describe('amountsFromSuggestion', () => {
  it('converte sugestão da API', () => {
    expect(
      amountsFromSuggestion({
        transport: '200.00',
        accommodation: '250.00',
        food: '300.00',
        activities: '250.00',
      })
    ).toEqual({
      transport: 200,
      accommodation: 250,
      food: 300,
      activities: 250,
    });
  });
});
