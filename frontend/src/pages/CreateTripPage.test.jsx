import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CreateTripPage } from './CreateTripPage.jsx';
import { toInputDate } from '../utils/format.js';

function addDaysToToday(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toInputDate(d);
}

const navigate = vi.fn();

vi.mock('../api/trips.js', () => ({ suggestBudget: vi.fn() }));
vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Teste', email: 't@t.com' },
    logout: vi.fn(),
  })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

import * as tripsApi from '../api/trips.js';

describe('CreateTripPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('valida campos obrigatórios', async () => {
    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    fireEvent.submit(document.getElementById('create-trip-form'));
    expect(
      screen.getByText('Preencha todos os campos para continuar.')
    ).toBeInTheDocument();
  });

  it('segue para orçamento com sugestão', async () => {
    tripsApi.suggestBudget.mockResolvedValue({ profile: 'urban', suggested: {} });
    const user = userEvent.setup();
    const start = addDaysToToday(30);
    const end = addDaysToToday(35);

    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Destino'), 'Curitiba');
    fireEvent.change(screen.getByLabelText('Data de ida'), { target: { value: start } });
    fireEvent.change(screen.getByLabelText('Data de volta'), { target: { value: end } });
    await user.type(screen.getByLabelText('Orçamento total (R$)'), '1000');
    await user.selectOptions(screen.getByLabelText('Perfil da viagem'), 'urban');
    await user.click(screen.getByRole('button', { name: /Continuar para orçamento/i }));

    expect(tripsApi.suggestBudget).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/viagens/nova/orcamento', expect.any(Object));
  });

  it('rejeita data de ida no passado', async () => {
    const user = userEvent.setup();
    const pastStart = addDaysToToday(-10);
    const pastEnd = addDaysToToday(-5);

    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Destino'), 'Curitiba');
    fireEvent.change(screen.getByLabelText('Data de ida'), { target: { value: pastStart } });
    fireEvent.change(screen.getByLabelText('Data de volta'), { target: { value: pastEnd } });
    await waitFor(() => {
      expect(screen.getByLabelText('Data de ida')).toHaveValue(pastStart);
    });
    await user.type(screen.getByLabelText('Orçamento total (R$)'), '1000');
    await user.selectOptions(screen.getByLabelText('Perfil da viagem'), 'urban');
    fireEvent.submit(document.getElementById('create-trip-form'));

    await waitFor(() => {
      expect(
        screen.getByText('A data de ida não pode ser anterior a hoje.')
      ).toBeInTheDocument();
    });
    expect(tripsApi.suggestBudget).not.toHaveBeenCalled();
  });
});
