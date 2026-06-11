import '../test-support/setupEnv.js';
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { env } from '../src/config/env.js';
import { pool } from '../src/config/database.js';

test('env carrega variáveis obrigatórias', () => {
  assert.equal(env.jwtSecret, 'test-jwt-secret-for-unit-tests');
  assert.ok(env.databaseUrl);
  assert.equal(env.nodeEnv, 'test');
  assert.equal(env.port, 4000);
});

test('pool emite handler de erro inesperado', () => {
  const spy = mock.method(console, 'error', () => {});
  pool.emit('error', new Error('conexão perdida'));
  assert.equal(spy.mock.callCount(), 1);
  assert.match(
    String(spy.mock.calls[0].arguments[0]),
    /PostgreSQL/
  );
  spy.mock.restore();
});
