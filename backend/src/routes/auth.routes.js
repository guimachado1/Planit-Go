import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';

const r = Router();

r.post('/register', authRateLimit, authController.register);
r.post('/login', authRateLimit, authController.login);
r.get('/me', authMiddleware, authController.me);

export default r;
