import '../test-support/setupEnv.js';
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../src/middleware/asyncHandler.js';
import { authMiddleware } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { env } from '../src/config/env.js';

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    headersSent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

test('asyncHandler repassa erros para next', async () => {
  const err = new Error('falhou');
  const fn = asyncHandler(async () => {
    throw err;
  });
  let passed;
  const next = (e) => {
    passed = e;
  };
  await fn({}, mockRes(), next);
  assert.equal(passed, err);
});

test('asyncHandler chama handler sem erro', async () => {
  const fn = asyncHandler(async (_req, res) => {
    res.status(200).json({ ok: true });
  });
  const res = mockRes();
  await fn({}, res, () => {});
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
});

test('authMiddleware rejeita sem Bearer token', () => {
  const res = mockRes();
  let nextCalled = false;
  authMiddleware({ headers: {} }, res, () => {
    nextCalled = true;
  });
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Token não informado.');
  assert.equal(nextCalled, false);
});

test('authMiddleware rejeita token inválido', () => {
  const res = mockRes();
  authMiddleware(
    { headers: { authorization: 'Bearer token-invalido' } },
    res,
    () => {}
  );
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Token inválido ou expirado.');
});

test('authMiddleware aceita token válido', () => {
  const token = jwt.sign(
    { sub: 'user-1', email: 'a@b.com' },
    env.jwtSecret
  );
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = mockRes();
  let nextCalled = false;
  authMiddleware(req, res, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
  assert.deepEqual(req.user, { id: 'user-1', email: 'a@b.com' });
});

test('errorHandler responde com status e mensagem', () => {
  const res = mockRes();
  const err = new Error('algo errado');
  err.status = 400;
  errorHandler(err, {}, res, () => {});
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'algo errado');
});

test('errorHandler oculta detalhe de erro 500 em produção', () => {
  const original = env.nodeEnv;
  env.nodeEnv = 'production';
  const res = mockRes();
  errorHandler(new Error('segredo'), {}, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.error, 'Erro interno do servidor.');
  env.nodeEnv = original;
});

test('errorHandler repassa quando headers já foram enviados', () => {
  const res = mockRes();
  res.headersSent = true;
  const err = new Error('tarde');
  let passed;
  errorHandler(err, {}, res, (e) => {
    passed = e;
  });
  assert.equal(passed, err);
});

test('errorHandler loga erros 5xx', () => {
  const res = mockRes();
  const err = new Error('falha grave');
  const spy = mock.method(console, 'error', () => {});
  errorHandler(err, {}, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.equal(spy.mock.callCount(), 1);
  spy.mock.restore();
});
