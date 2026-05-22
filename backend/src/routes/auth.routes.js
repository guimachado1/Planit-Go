import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const r = Router();

r.post('/register', authController.register);
r.post('/login', authController.login);
r.get('/me', authMiddleware, authController.me);

export default r;
