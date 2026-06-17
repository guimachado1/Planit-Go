import pg from 'pg';
import { env } from './env.js';
import { getPgClientConfig } from './pgSsl.js';

const { Pool } = pg;

export const pool = new Pool({
  ...getPgClientConfig(env.databaseUrl),
  max: 10,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool PostgreSQL:', err.message);
});
