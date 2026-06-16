import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const post = vi.fn();
const patch = vi.fn();
const del = vi.fn();

vi.mock('./client.js', () => ({
  default: { get, post, patch, delete: del },
}));

const {
  getItinerary,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} = await import('./itinerary.js');

describe('itinerary api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getItinerary busca roteiro', async () => {
    get.mockResolvedValue({ data: { itinerary: { days: [] } } });
    const itinerary = await getItinerary('t1');
    expect(itinerary.days).toEqual([]);
  });

  it('createItineraryItem normaliza item', async () => {
    post.mockResolvedValue({
      data: {
        item: {
          id: 'i1',
          trip_id: 't1',
          day_date: '2026-09-01',
          title: 'Museu',
          description: null,
          start_time: '10:00',
          sort_order: 0,
          created_at: 'x',
          updated_at: 'x',
        },
      },
    });

    const item = await createItineraryItem('t1', {
      dayDate: '2026-09-01',
      title: 'Museu',
      startTime: '10:00',
    });

    expect(item.dayDate).toBe('2026-09-01');
    expect(item.startTime).toBe('10:00');
  });

  it('updateItineraryItem envia patch', async () => {
    patch.mockResolvedValue({
      data: {
        item: {
          id: 'i1',
          trip_id: 't1',
          day_date: '2026-09-02',
          title: 'Parque',
          description: null,
          start_time: null,
          sort_order: 0,
          created_at: 'x',
          updated_at: 'x',
        },
      },
    });

    await updateItineraryItem('t1', 'i1', {
      dayDate: '2026-09-02',
      title: 'Parque',
      startTime: null,
      description: null,
    });

    expect(patch).toHaveBeenCalled();
  });

  it('deleteItineraryItem remove item', async () => {
    del.mockResolvedValue({});
    await deleteItineraryItem('t1', 'i1');
    expect(del).toHaveBeenCalledWith('/api/trips/t1/itinerary/items/i1');
  });
});
