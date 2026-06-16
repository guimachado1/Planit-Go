import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage.jsx';

const register = vi.fn();
const navigate = vi.fn();

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

import { useAuth } from '../context/AuthContext.jsx';

describe('RegisterPage', () => {
  it('cadastra usuário', async () => {
    register.mockResolvedValue({});
    useAuth.mockReturnValue({
      register,
      isAuthenticated: false,
      bootstrapping: false,
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Nome'), 'Maria');
    await user.type(screen.getByLabelText('E-mail'), 'maria@example.com');
    await user.type(screen.getByLabelText('Senha (mín. 8)'), 'senha12345');
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(register).toHaveBeenCalledWith({
      fullName: 'Maria',
      email: 'maria@example.com',
      password: 'senha12345',
    });
  });
});
