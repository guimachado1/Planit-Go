import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripBudgetPage } from './TripBudgetPage.jsx';

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Teste', email: 't@t.com' },
    logout: vi.fn(),
  })),
}));

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

describe('TripBudgetPage', () => {
  it('redireciona sem state da navegação', () => {
    render(
      <MemoryRouter initialEntries={['/viagens/nova/orcamento']}>
        <TripBudgetPage />
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith('/viagens/nova', { replace: true });
  });

  it('renderiza painel de orçamento com state', () => {
    const tripForm = {
      destination: 'Curitiba',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      totalBudget: 1000,
      profile: 'urban',
    };
    const suggestion = {
      profile: 'urban',
      suggested: { transport: 200, accommodation: 250, food: 300, activities: 250 },
    };

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/viagens/nova/orcamento',
            state: { tripForm, suggestion },
          },
        ]}
      >
        <TripBudgetPage />
      </MemoryRouter>
    );

    expect(document.body.textContent).toContain('Curitiba');
    expect(document.body.textContent).toContain('Resumo do orçamento');
  });
});
