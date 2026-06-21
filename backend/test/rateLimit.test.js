import '../test-support/setupEnv.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiRateLimit, authRateLimit } from '../src/middleware/rateLimit.js';

function runMiddleware(middleware) {
  return new Promise((resolve, reject) => {
    const req = { ip: '127.0.0.1', headers: {} };
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
      setHeader() {},
    };
    middleware(req, res, (err) => {
      if (err) reject(err);
      else resolve({ req, res });
    });
  });
}

test('rate limiters são no-op em NODE_ENV=test', async () => {
  const apiResult = await runMiddleware(apiRateLimit);
  assert.equal(apiResult.res.statusCode, 200);
  assert.equal(apiResult.res.body, null);

  const authResult = await runMiddleware(authRateLimit);
  assert.equal(authResult.res.statusCode, 200);
  assert.equal(authResult.res.body, null);
});
