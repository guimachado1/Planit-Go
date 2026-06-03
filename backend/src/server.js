import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/database.js';

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL: conexão OK');
  } catch (err) {
    console.error(
      'PostgreSQL: falha na conexão. Login/cadastro e viagens não funcionarão.',
      '\n  Verifique se o banco está rodando e se DATABASE_URL no .env está correto.',
      '\n  Com Docker: docker compose up -d  →  porta host 5433',
      '\n  Depois: npm run migrate',
      '\n  Erro:',
      err.message
    );
  }

  app.listen(env.port, () => {
    console.log(`Planit Go API listening on port ${env.port}`);
  });
}

start();
