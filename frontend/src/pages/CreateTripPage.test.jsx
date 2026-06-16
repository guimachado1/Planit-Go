import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CreateTripPage } from './CreateTripPage.jsx';

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

    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Destino'), 'Curitiba');
    await user.type(screen.getByLabelText('Data de ida'), '2026-09-01');
    await user.type(screen.getByLabelText('Data de volta'), '2026-09-05');
    await user.type(screen.getByLabelText('Orçamento total (R$)'), '1000');
    await user.selectOptions(screen.getByLabelText('Perfil da viagem'), 'urban');
    await user.click(screen.getByRole('button', { name: /Continuar para orçamento/i }));

    expect(tripsApi.suggestBudget).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/viagens/nova/orcamento', expect.any(Object));
  });
});
