import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.fn();
const get = vi.fn();

vi.mock('./client.js', () => ({
  default: { post, get },
}));

const {
  suggestBudget,
  previewBudget,
  createTrip,
  listTrips,
  getTrip,
} = await import('./trips.js');

describe('trips api', () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it('suggestBudget envia perfil e total', async () => {
    post.mockResolvedValue({ data: { profile: 'urban' } });
    await suggestBudget({ profile: 'urban', totalBudget: 1000 });
    expect(post).toHaveBeenCalledWith('/api/trips/budget/suggest', {
      profile: 'urban',
      totalBudget: 1000,
    });
  });

  it('previewBudget envia ajuste manual', async () => {
    const payload = {
      profile: 'urban',
      totalBudget: 1000,
      categoryAmounts: { transport: 250 },
    };
    post.mockResolvedValue({ data: { distributionMode: 'manual' } });
    await previewBudget(payload);
    expect(post).toHaveBeenCalledWith('/api/trips/budget/preview', payload);
  });

  it('createTrip retorna viagem', async () => {
    post.mockResolvedValue({ data: { trip: { id: 'trip-1' } } });
    const trip = await createTrip({ destination: 'Curitiba' });
    expect(trip.id).toBe('trip-1');
  });

  it('listTrips retorna lista', async () => {
    get.mockResolvedValue({ data: { trips: [{ id: 'trip-1' }] } });
    const trips = await listTrips();
    expect(trips).toHaveLength(1);
  });

  it('getTrip busca por id', async () => {
    get.mockResolvedValue({ data: { trip: { id: 'trip-2' } } });
    const trip = await getTrip('trip-2');
    expect(trip.id).toBe('trip-2');
  });
});
