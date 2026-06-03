import client from './client.js';

export async function login(email, password) {
  const { data } = await client.post('/api/auth/login', { email, password });
  return data;
}

export async function register(payload) {
  const { data } = await client.post('/api/auth/register', payload);
  return data;
}

export async function fetchMe() {
  const { data } = await client.get('/api/auth/me');
  return data.user;
}
