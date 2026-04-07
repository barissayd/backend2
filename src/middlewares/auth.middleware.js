import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../modules/users/user.model.js';

export const authMiddleware = catchAsync(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) throw new AppError('Authentication required', 401);

  const decoded = verifyAccessToken(token); // throws -> handled globally

  const user = await User.findById(decoded.sub);
  if (!user) throw new AppError('User no longer exists', 401);

  req.user = user;
  next();
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Insufficient permissions', 403));
  }
  next();
};
