import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute.jsx';

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext.jsx';

describe('ProtectedRoute', () => {
  it('mostra loading durante bootstrap', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      bootstrapping: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando…')).toBeInTheDocument();
  });

  it('redireciona para login sem autenticação', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      bootstrapping: false,
    });

    render(
      <MemoryRouter initialEntries={['/viagens']}>
        <Routes>
          <Route path="/login" element={<p>Página de login</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/viagens" element={<p>Lista</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de login')).toBeInTheDocument();
  });

  it('renderiza rota protegida quando autenticado', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      bootstrapping: false,
    });

    render(
      <MemoryRouter initialEntries={['/viagens']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/viagens" element={<p>Lista de viagens</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Lista de viagens')).toBeInTheDocument();
  });
});
