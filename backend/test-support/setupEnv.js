process.env.DATABASE_URL ??=
  'postgres://test:test@localhost:5432/planit_test';
process.env.JWT_SECRET ??= 'test-jwt-secret-for-unit-tests';
process.env.NODE_ENV ??= 'test';
