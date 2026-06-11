import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { TripCard } from './TripCard.jsx';

describe('TripCard', () => {
  it('exibe destino, perfil e orçamento', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00'));

    render(
      <MemoryRouter>
        <TripCard
          trip={{
            id: 'trip-1',
            destination: 'Curitiba',
            profile: 'urban',
            startDate: '2026-06-01',
            endDate: '2026-06-30',
            totalBudget: '1500.00',
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Curitiba')).toBeInTheDocument();
    expect(screen.getByText('Urbana / Cidade grande')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*1\.500,00/)).toBeInTheDocument();
    expect(screen.getByText('Em andamento')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
