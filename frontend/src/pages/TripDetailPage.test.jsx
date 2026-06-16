import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TripDetailPage } from './TripDetailPage.jsx';

vi.mock('../hooks/useTripFinances.js', () => ({
  useTripFinances: vi.fn(),
}));

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Teste', email: 't@t.com' },
    logout: vi.fn(),
  })),
}));

import { useTripFinances } from '../hooks/useTripFinances.js';

const trip = {
  id: 't1',
  destination: 'Curitiba',
  profile: 'urban',
  startDate: '2026-09-01',
  endDate: '2026-09-05',
  totalBudget: '1000.00',
  createdAt: '2026-01-01',
};

describe('TripDetailPage', () => {
  it('mostra loading', () => {
    useTripFinances.mockReturnValue({
      loading: true,
      trip: null,
      summary: null,
      expenses: [],
      error: '',
      addExpense: vi.fn(),
      reload: vi.fn(),
      refreshing: false,
    });

    render(
      <MemoryRouter initialEntries={['/viagens/t1']}>
        <Routes>
          <Route path="/viagens/:id" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando viagem…')).toBeInTheDocument();
  });

  it('renderiza detalhe da viagem', () => {
    useTripFinances.mockReturnValue({
      loading: false,
      trip,
      summary: { totalBudget: 1000, totalSpent: 200, totalRemaining: 800 },
      expenses: [],
      error: '',
      addExpense: vi.fn(),
      reload: vi.fn(),
      refreshing: false,
    });

    render(
      <MemoryRouter initialEntries={['/viagens/t1']}>
        <Routes>
          <Route path="/viagens/:id" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Curitiba' })).toBeInTheDocument();
    expect(screen.getByText('Resumo financeiro')).toBeInTheDocument();
  });
});
