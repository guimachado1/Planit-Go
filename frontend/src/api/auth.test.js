import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.fn();
const get = vi.fn();

vi.mock('./client.js', () => ({
  default: { post, get },
}));

const { login, register, fetchMe } = await import('./auth.js');

describe('auth api', () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it('login chama endpoint correto', async () => {
    post.mockResolvedValue({ data: { token: 't1', user: { id: '1' } } });
    const data = await login('a@b.com', 'senha12345');
    expect(post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'a@b.com',
      password: 'senha12345',
    });
    expect(data.token).toBe('t1');
  });

  it('register envia payload', async () => {
    const payload = {
      email: 'a@b.com',
      password: 'senha12345',
      fullName: 'Nome',
      acceptPrivacyPolicy: true,
    };
    post.mockResolvedValue({ data: { token: 't2', user: { id: '2' } } });
    await register(payload);
    expect(post).toHaveBeenCalledWith('/api/auth/register', payload);
  });

  it('fetchMe retorna usuário', async () => {
    get.mockResolvedValue({ data: { user: { id: '3', email: 'a@b.com' } } });
    const user = await fetchMe();
    expect(get).toHaveBeenCalledWith('/api/auth/me');
    expect(user.email).toBe('a@b.com');
  });
});
