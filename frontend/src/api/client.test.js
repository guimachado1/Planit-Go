import { beforeEach, describe, expect, it, vi } from 'vitest';

const handlers = { fulfilled: null, rejected: null };

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      defaults: { headers: { common: {} } },
      interceptors: {
        response: {
          use: (ok, err) => {
            handlers.fulfilled = ok;
            handlers.rejected = err;
          },
        },
      },
    })),
  },
}));

const { default: client, setAuthToken } = await import('./client.js');

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    delete client.defaults.headers.common.Authorization;
  });

  it('setAuthToken define header Bearer', () => {
    setAuthToken('abc');
    expect(client.defaults.headers.common.Authorization).toBe('Bearer abc');
  });

  it('setAuthToken remove header quando token é nulo', () => {
    setAuthToken('abc');
    setAuthToken(null);
    expect(client.defaults.headers.common.Authorization).toBeUndefined();
  });

  it('interceptor limpa token e redireciona em 401', async () => {
    localStorage.setItem('planit_go_token', 'old');
    window.history.pushState({}, '', '/viagens');
    const assign = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, pathname: '/viagens', assign },
      writable: true,
    });

    const rejectPromise = handlers.rejected({
      response: { status: 401 },
      config: { url: '/api/trips' },
    });

    await expect(rejectPromise).rejects.toBeTruthy();
    expect(localStorage.getItem('planit_go_token')).toBeNull();
    expect(assign).toHaveBeenCalledWith('/login');
  });

  it('interceptor ignora 401 na rota de login', async () => {
    localStorage.setItem('planit_go_token', 'old');

    const err = { response: { status: 401 }, config: { url: '/api/auth/login' } };
    await expect(handlers.rejected(err)).rejects.toBe(err);
    expect(localStorage.getItem('planit_go_token')).toBe('old');
  });

  it('interceptor repassa resposta em sucesso', () => {
    const res = { data: { ok: true } };
    expect(handlers.fulfilled(res)).toBe(res);
  });
});
