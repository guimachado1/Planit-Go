import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TripReportPage } from './TripReportPage.jsx';

vi.mock('../hooks/useTripReport.js', () => ({
  useTripReport: vi.fn(),
}));

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Teste', email: 't@t.com' },
    logout: vi.fn(),
  })),
}));

import { useTripReport } from '../hooks/useTripReport.js';

describe('TripReportPage', () => {
  it('renderiza relatório', () => {
    useTripReport.mockReturnValue({
      loading: false,
      trip: {
        id: 't1',
        destination: 'Curitiba',
        profile: 'urban',
        startDate: '2026-01-01',
        endDate: '2026-01-05',
        totalBudget: '1000.00',
        status: 'completed',
        statusLabel: 'Finalizada',
      },
      summary: {
        totalBudget: 1000,
        totalSpent: 900,
        totalRemaining: 100,
        byCategory: [],
      },
      itinerary: { days: [] },
      error: '',
      reload: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/viagens/t1/relatorio']}>
        <Routes>
          <Route path="/viagens/:id/relatorio" element={<TripReportPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Relatório final da viagem')).toBeInTheDocument();
    expect(screen.getByText('Curitiba')).toBeInTheDocument();
  });
});
