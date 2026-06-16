import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TripsPage } from './TripsPage.jsx';
import { renderWithRouter } from '../test/renderWithRouter.jsx';

vi.mock('../api/trips.js', () => ({ listTrips: vi.fn() }));
vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Teste', email: 't@t.com' },
    logout: vi.fn(),
  })),
}));

import * as tripsApi from '../api/trips.js';

describe('TripsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra estado vazio', async () => {
    tripsApi.listTrips.mockResolvedValue([]);
    renderWithRouter(<TripsPage />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma viagem planejada')).toBeInTheDocument();
    });
  });

  it('lista viagens', async () => {
    tripsApi.listTrips.mockResolvedValue([
      {
        id: 't1',
        destination: 'Curitiba',
        profile: 'urban',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        totalBudget: '1000.00',
      },
    ]);

    renderWithRouter(<TripsPage />);

    await waitFor(() => {
      expect(screen.getByText('Curitiba')).toBeInTheDocument();
    });
  });
});
