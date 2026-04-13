import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import metaRoutes from './routes/meta.routes.js';
import tripRoutes from './routes/trip.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
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
