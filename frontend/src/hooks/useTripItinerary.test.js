import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useTripItinerary } from './useTripItinerary.js';

vi.mock('../api/trips.js', () => ({ getTrip: vi.fn() }));
vi.mock('../api/itinerary.js', () => ({
  getItinerary: vi.fn(),
  createItineraryItem: vi.fn(),
  updateItineraryItem: vi.fn(),
  deleteItineraryItem: vi.fn(),
}));

import * as tripsApi from '../api/trips.js';
import * as itineraryApi from '../api/itinerary.js';

const trip = { id: 't1', destination: 'Curitiba' };
const itinerary = { days: [{ date: '2026-09-01', dayNumber: 1, items: [] }] };

describe('useTripItinerary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tripsApi.getTrip.mockResolvedValue(trip);
    itineraryApi.getItinerary.mockResolvedValue(itinerary);
  });

  it('carrega viagem e itinerário', async () => {
    const { result } = renderHook(() => useTripItinerary('t1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.trip.destination).toBe('Curitiba');
    expect(result.current.itinerary.days).toHaveLength(1);
  });

  it('addItem recarrega itinerário', async () => {
    const { result } = renderHook(() => useTripItinerary('t1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addItem({ dayDate: '2026-09-01', title: 'Museu' });
    });

    expect(itineraryApi.createItineraryItem).toHaveBeenCalled();
    expect(itineraryApi.getItinerary).toHaveBeenCalledTimes(2);
  });

  it('removeItem chama API', async () => {
    const { result } = renderHook(() => useTripItinerary('t1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.removeItem('item-1');
    });

    expect(itineraryApi.deleteItineraryItem).toHaveBeenCalledWith('t1', 'item-1');
  });
});
