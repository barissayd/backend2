import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() })
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
