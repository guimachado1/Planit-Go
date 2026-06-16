import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { ItineraryItemRow } from './ItineraryItemRow.jsx';

const days = [
  { date: '2026-09-01', dayNumber: 1 },
  { date: '2026-09-02', dayNumber: 2 },
];

const item = {
  id: 'i1',
  title: 'Museu',
  startTime: '10:00',
  description: 'Centro',
};

describe('ItineraryItemRow', () => {
  it('exibe atividade e entra em edição', async () => {
    const user = userEvent.setup();

    render(
      <ItineraryItemRow
        item={item}
        dayDate="2026-09-01"
        days={days}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Museu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Editar atividade' }));
    expect(screen.getByDisplayValue('Museu')).toBeInTheDocument();
  });
});
