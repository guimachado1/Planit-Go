import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { ItineraryItemForm } from './ItineraryItemForm.jsx';

const days = [{ date: '2026-09-01', dayNumber: 1 }];

describe('ItineraryItemForm', () => {
  it('valida título obrigatório', async () => {
    render(<ItineraryItemForm days={days} onSubmit={vi.fn()} />);

    const form = screen.getByRole('button', { name: /Adicionar atividade/i }).closest('form');
    fireEvent.submit(form);
    expect(
      screen.getByText('Preencha o dia e o título da atividade.')
    ).toBeInTheDocument();
  });

  it('envia atividade válida', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ItineraryItemForm days={days} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Título'), 'Museu');
    await user.click(screen.getByRole('button', { name: /Adicionar atividade/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      dayDate: '2026-09-01',
      title: 'Museu',
      startTime: undefined,
      description: undefined,
    });
  });
});
