import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useTripFinances } from './useTripFinances.js';

vi.mock('../api/trips.js', () => ({ getTrip: vi.fn() }));
vi.mock('../api/expenses.js', () => ({
  getFinancialSummary: vi.fn(),
  listExpenses: vi.fn(),
  createExpense: vi.fn(),
}));

import * as tripsApi from '../api/trips.js';
import * as expensesApi from '../api/expenses.js';

const trip = {
  id: 't1',
  destination: 'Curitiba',
  startDate: '2026-09-01',
  endDate: '2026-09-05',
};

describe('useTripFinances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tripsApi.getTrip.mockResolvedValue(trip);
    expensesApi.getFinancialSummary.mockResolvedValue({ totalBudget: 1000 });
    expensesApi.listExpenses.mockResolvedValue([]);
  });

  it('carrega viagem, resumo e gastos', async () => {
    const { result } = renderHook(() => useTripFinances('t1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.trip.destination).toBe('Curitiba');
    expect(result.current.summary.totalBudget).toBe(1000);
    expect(result.current.expenses).toEqual([]);
  });

  it('define erro quando falha', async () => {
    tripsApi.getTrip.mockRejectedValue({ response: { data: { error: 'falhou' } } });

    const { result } = renderHook(() => useTripFinances('t1'));

    await waitFor(() => {
      expect(result.current.error).toBe('falhou');
    });
  });

  it('addExpense recarrega dados', async () => {
    const { result } = renderHook(() => useTripFinances('t1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addExpense({
        category: 'food',
        amount: 50,
        spentAt: '2026-09-02',
      });
    });

    expect(expensesApi.createExpense).toHaveBeenCalled();
    expect(tripsApi.getTrip).toHaveBeenCalledTimes(2);
  });
});
