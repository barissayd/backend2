import { Router } from 'express';
import * as controller from './user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from './user.validator.js';

const router = Router();

// All user routes are protected
router.use(authMiddleware);

router.get('/', validate(listUsersQuerySchema), controller.list);
router.post('/', validate(createUserSchema), controller.create);
router.get('/:id', validate(userIdParamSchema), controller.getById);
router.patch('/:id', validate(updateUserSchema), controller.update);
router.delete('/:id', validate(userIdParamSchema), controller.remove);

export default router;
