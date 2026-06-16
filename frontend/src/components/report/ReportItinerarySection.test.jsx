import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportItinerarySection } from './ReportItinerarySection.jsx';

describe('ReportItinerarySection', () => {
  it('retorna null sem dias', () => {
    const { container } = render(<ReportItinerarySection itinerary={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('lista atividades por dia', () => {
    render(
      <ReportItinerarySection
        itinerary={{
          days: [
            {
              date: '2026-09-01',
              dayNumber: 1,
              items: [
                {
                  id: 'i1',
                  title: 'Museu',
                  startTime: '10:00:00',
                  description: 'Visita guiada',
                },
              ],
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Itinerário')).toBeInTheDocument();
    expect(screen.getByText('Museu')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });
});
