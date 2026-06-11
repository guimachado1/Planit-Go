import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext.jsx';

vi.mock('../api/auth.js', () => ({
  login: vi.fn(),
  register: vi.fn(),
  fetchMe: vi.fn(),
}));

vi.mock('../api/client.js', () => ({
  setAuthToken: vi.fn(),
}));

import * as authApi from '../api/auth.js';
import { setAuthToken } from '../api/client.js';

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    authApi.fetchMe.mockResolvedValue({ id: '1', email: 'a@b.com' });
  });

  it('useAuth exige provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider'
    );
    spy.mockRestore();
  });

  it('login armazena token e usuário', async () => {
    authApi.login.mockResolvedValue({
      token: 'token-1',
      user: { id: '1', email: 'a@b.com' },
    });
    authApi.fetchMe.mockResolvedValue({ id: '1', email: 'a@b.com' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('a@b.com', 'senha12345');
    });

    await waitFor(() => {
      expect(result.current.user?.email).toBe('a@b.com');
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('planit_go_token')).toBe('token-1');
    expect(setAuthToken).toHaveBeenCalledWith('token-1');
  });

  it('logout limpa sessão', async () => {
    authApi.login.mockResolvedValue({
      token: 'token-1',
      user: { id: '1', email: 'a@b.com' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('a@b.com', 'senha12345');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('planit_go_token')).toBeNull();
  });

  it('restaura usuário com token salvo', async () => {
    localStorage.setItem('planit_go_token', 'token-salvo');
    authApi.fetchMe.mockResolvedValue({ id: '9', email: 'salvo@b.com' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.bootstrapping).toBe(false);
    });

    expect(result.current.user.email).toBe('salvo@b.com');
  });

  it('remove token inválido no bootstrap', async () => {
    localStorage.setItem('planit_go_token', 'token-invalido');
    authApi.fetchMe.mockRejectedValue(new Error('401'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.bootstrapping).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('planit_go_token')).toBeNull();
  });
});
