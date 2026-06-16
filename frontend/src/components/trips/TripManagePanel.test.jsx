import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { TripManagePanel } from './TripManagePanel.jsx';

vi.mock('../../api/trips.js', () => ({
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
}));

import * as tripsApi from '../../api/trips.js';

const trip = {
  id: 't1',
  destination: 'Curitiba',
  startDate: '2026-09-01',
  endDate: '2026-09-05',
};

describe('TripManagePanel', () => {
  it('salva novas datas', async () => {
    tripsApi.updateTrip.mockResolvedValue(trip);
    const onUpdated = vi.fn();
    const user = userEvent.setup();

    render(<TripManagePanel trip={trip} onUpdated={onUpdated} />);

    await user.click(screen.getByText('Editar ou excluir viagem'));
    await user.clear(screen.getByLabelText('Início'));
    await user.type(screen.getByLabelText('Início'), '2026-09-02');
    await user.click(screen.getByRole('button', { name: /Salvar datas/i }));

    expect(tripsApi.updateTrip).toHaveBeenCalledWith('t1', {
      startDate: '2026-09-02',
      endDate: '2026-09-05',
    });
    expect(onUpdated).toHaveBeenCalled();
  });
});
