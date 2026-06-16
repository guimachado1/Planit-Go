import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ItineraryDaySection } from './ItineraryDaySection.jsx';

describe('ItineraryDaySection', () => {
  it('mostra dia sem atividades', () => {
    render(
      <ItineraryDaySection
        day={{ date: '2026-09-01', dayNumber: 1, items: [] }}
        days={[{ date: '2026-09-01', dayNumber: 1 }]}
        onUpdate={async () => {}}
        onDelete={async () => {}}
      />
    );

    expect(screen.getByText('Sem atividades')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma atividade neste dia.')).toBeInTheDocument();
  });

  it('lista atividades do dia', () => {
    render(
      <ItineraryDaySection
        day={{
          date: '2026-09-01',
          dayNumber: 1,
          items: [{ id: 'i1', title: 'Museu', startTime: '10:00', description: null }],
        }}
        days={[{ date: '2026-09-01', dayNumber: 1 }]}
        onUpdate={async () => {}}
        onDelete={async () => {}}
      />
    );

    expect(screen.getByText('Museu')).toBeInTheDocument();
  });
});
