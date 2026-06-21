import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/** Em testes unitários/integração o limiter fica inativo para não flaky. */
function passthrough(_req, _res, next) {
  next();
}

function createLimiter({ message, ...options }) {
  if (env.nodeEnv === 'test') {
    return passthrough;
  }

  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      res.status(429).json({ error: message });
    },
    ...options,
  });
}

/** Limite geral da API — evita abuso em massa. */
export const apiRateLimit = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Muitas requisições. Aguarde alguns minutos e tente novamente.',
});

/** Login e cadastro — proteção contra brute force (por IP). */
export const authRateLimit = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    'Muitas tentativas de login ou cadastro. Tente novamente em 15 minutos.',
});
