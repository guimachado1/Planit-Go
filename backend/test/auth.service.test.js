import '../test-support/setupEnv.js';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import {
  installPoolMock,
  restorePoolMock,
  onPoolQuery,
} from '../test-support/mockPool.js';
import * as authService from '../src/services/auth.service.js';

const userRow = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'teste@example.com',
  password_hash: '',
  full_name: 'Teste User',
  created_at: new Date('2026-01-01'),
};

beforeEach(async () => {
  installPoolMock();
  userRow.password_hash = await bcrypt.hash('senha12345', 12);
});

afterEach(() => {
  restorePoolMock();
});

test('register rejeita e-mail inválido', async () => {
  await assert.rejects(
    () =>
      authService.register({
        email: 'invalido',
        password: 'senha12345',
        fullName: 'Nome',
      }),
    (err) => err.status === 400 && err.message.includes('E-mail')
  );
});

test('register rejeita senha curta', async () => {
  await assert.rejects(
    () =>
      authService.register({
        email: 'a@b.com',
        password: '123',
        fullName: 'Nome',
      }),
    (err) => err.status === 400 && err.message.includes('senha')
  );
});

test('register rejeita nome curto', async () => {
  await assert.rejects(
    () =>
      authService.register({
        email: 'a@b.com',
        password: 'senha12345',
        fullName: 'A',
      }),
    (err) => err.status === 400 && err.message.includes('nome')
  );
});

test('register rejeita e-mail duplicado', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      authService.register({
        email: 'teste@example.com',
        password: 'senha12345',
        fullName: 'Nome',
      }),
    (err) => err.status === 409
  );
});

test('register cria usuário e retorna token', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [] };
    }
    if (sql.includes('INSERT INTO users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  const result = await authService.register({
    email: 'teste@example.com',
    password: 'senha12345',
    fullName: 'Teste User',
  });

  assert.equal(result.user.email, 'teste@example.com');
  assert.equal(result.user.fullName, 'Teste User');
  assert.ok(result.token);
});

test('login rejeita credenciais inválidas quando usuário não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () =>
      authService.login({
        email: 'teste@example.com',
        password: 'senha12345',
      }),
    (err) => err.status === 401
  );
});

test('login rejeita senha incorreta', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  await assert.rejects(
    () =>
      authService.login({
        email: 'teste@example.com',
        password: 'senhaerrada1',
      }),
    (err) => err.status === 401
  );
});

test('login autentica com credenciais válidas', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  const result = await authService.login({
    email: 'teste@example.com',
    password: 'senha12345',
  });

  assert.equal(result.user.id, userRow.id);
  assert.ok(result.token);
});

test('getMe retorna 404 quando usuário não existe', async () => {
  onPoolQuery(() => ({ rows: [] }));

  await assert.rejects(
    () => authService.getMe('id-inexistente'),
    (err) => err.status === 404
  );
});

test('getMe retorna usuário público', async () => {
  onPoolQuery((sql) => {
    if (sql.includes('FROM users')) {
      return { rows: [userRow] };
    }
    return { rows: [] };
  });

  const user = await authService.getMe(userRow.id);
  assert.equal(user.email, userRow.email);
  assert.equal(user.fullName, userRow.full_name);
});
