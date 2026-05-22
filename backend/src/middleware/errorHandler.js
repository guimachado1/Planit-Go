import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && env.nodeEnv === 'production'
      ? 'Erro interno do servidor.'
      : err.message || 'Erro interno do servidor.';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}
