import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import metaRoutes from './routes/meta.routes.js';
import tripRoutes from './routes/trip.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

const app = express();

app.use(helmet());

const corsOrigin = env.corsOrigin;
if (env.nodeEnv === 'production' && !corsOrigin) {
  console.warn(
    'CORS_ORIGIN não definido em produção — defina a URL do frontend (ex.: Amplify).'
  );
}

app.use(
  cors({
    origin: corsOrigin || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'planit-go-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api', metaRoutes);
app.use('/api/trips', tripRoutes);

app.use(errorHandler);

export default app;
