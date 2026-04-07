import { Router } from 'express';
import * as controller from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from './auth.validator.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', authMiddleware, controller.logout);

export default router;
