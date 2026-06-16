import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTripReport } from './useTripReport.js';

vi.mock('../api/trips.js', () => ({ getTrip: vi.fn() }));
vi.mock('../api/expenses.js', () => ({ getFinancialSummary: vi.fn() }));
vi.mock('../api/itinerary.js', () => ({ getItinerary: vi.fn() }));

import * as tripsApi from '../api/trips.js';
import * as expensesApi from '../api/expenses.js';
import * as itineraryApi from '../api/itinerary.js';

describe('useTripReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tripsApi.getTrip.mockResolvedValue({ id: 't1', destination: 'Curitiba' });
    expensesApi.getFinancialSummary.mockResolvedValue({ totalBudget: 1000 });
    itineraryApi.getItinerary.mockResolvedValue({ days: [] });
  });

  it('carrega dados do relatório', async () => {
    const { result } = renderHook(() => useTripReport('t1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.trip.destination).toBe('Curitiba');
    expect(result.current.summary.totalBudget).toBe(1000);
    expect(result.current.itinerary.days).toEqual([]);
  });

  it('expõe erro de carregamento', async () => {
    tripsApi.getTrip.mockRejectedValue(new Error('falhou'));

    const { result } = renderHook(() => useTripReport('t1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('falhou');
  });
});
