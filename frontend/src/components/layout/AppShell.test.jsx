import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell.jsx';
import { renderWithRouter } from '../../test/renderWithRouter.jsx';

vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext.jsx';

describe('AppShell', () => {
  it('renderiza conteúdo e ações do usuário', async () => {
    const logout = vi.fn();
    useAuth.mockReturnValue({
      user: { fullName: 'Maria Silva', email: 'maria@example.com' },
      logout,
    });

    renderWithRouter(
      <AppShell>
        <p>Conteúdo interno</p>
      </AppShell>
    );

    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByTitle('Sair'));
    expect(logout).toHaveBeenCalled();
  });
});
