import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout.jsx';

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext.jsx';

describe('Layout', () => {
  it('mostra links públicos sem autenticação', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, logout: vi.fn() });

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>Home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
  });

  it('faz logout quando autenticado', async () => {
    const logout = vi.fn();
    useAuth.mockReturnValue({ isAuthenticated: true, logout });

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>Home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Sair' }));
    expect(logout).toHaveBeenCalled();
  });
});
