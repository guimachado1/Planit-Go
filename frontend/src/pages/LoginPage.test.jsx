import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage.jsx';

const login = vi.fn();
const navigate = vi.fn();

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

import { useAuth } from '../context/AuthContext.jsx';

describe('LoginPage', () => {
  it('redireciona quando já autenticado', () => {
    useAuth.mockReturnValue({
      login,
      isAuthenticated: true,
      bootstrapping: false,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.queryByText('Começar a planejar')).not.toBeInTheDocument();
  });

  it('envia credenciais no submit', async () => {
    login.mockResolvedValue({});
    useAuth.mockReturnValue({
      login,
      isAuthenticated: false,
      bootstrapping: false,
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('E-mail'), 'teste@example.com');
    await user.type(screen.getByLabelText('Senha'), 'senha12345');
    await user.click(screen.getByRole('button', { name: /Começar a planejar/i }));

    expect(login).toHaveBeenCalledWith('teste@example.com', 'senha12345');
    expect(navigate).toHaveBeenCalledWith('/viagens');
  });

  it('alterna visibilidade da senha', async () => {
    useAuth.mockReturnValue({
      login,
      isAuthenticated: false,
      bootstrapping: false,
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Senha');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
