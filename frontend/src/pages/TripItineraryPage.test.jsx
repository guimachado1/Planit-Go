import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TripItineraryPage } from './TripItineraryPage.jsx';

vi.mock('../hooks/useTripItinerary.js', () => ({
  useTripItinerary: vi.fn(),
}));

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Teste', email: 't@t.com' },
    logout: vi.fn(),
  })),
}));

import { useTripItinerary } from '../hooks/useTripItinerary.js';

describe('TripItineraryPage', () => {
  it('renderiza itinerário', () => {
    useTripItinerary.mockReturnValue({
      loading: false,
      trip: {
        id: 't1',
        destination: 'Curitiba',
        profile: 'urban',
        startDate: '2026-09-01',
        endDate: '2026-09-02',
        totalBudget: '1000.00',
      },
      itinerary: {
        days: [{ date: '2026-09-01', dayNumber: 1, items: [] }],
      },
      error: '',
      refreshing: false,
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/viagens/t1/itinerario']}>
        <Routes>
          <Route path="/viagens/:id/itinerario" element={<TripItineraryPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Itinerário diário')).toBeInTheDocument();
    expect(screen.getByText('Nova atividade')).toBeInTheDocument();
  });
});
