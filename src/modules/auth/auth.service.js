import bcrypt from 'bcryptjs';
import User from '../users/user.model.js';
import AppError from '../../utils/AppError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';

const issueTokenPair = async (user) => {
  const payload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store hashed refresh token so it can be revoked / rotated
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { accessToken, refreshToken };
};

export const register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already in use', 409);

  const user = await User.create({ name, email, password });
  const tokens = await issueTokenPair(user);
  return { user, ...tokens };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshTokenHash');
  if (!user) throw new AppError('Invalid credentials', 401);

  const ok = await user.comparePassword(password);
  if (!ok) throw new AppError('Invalid credentials', 401);

  const tokens = await issueTokenPair(user);
  return { user, ...tokens };
};

export const refreshTokens = async (refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user || !user.refreshTokenHash) {
    throw new AppError('Refresh token revoked', 401);
  }

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) throw new AppError('Refresh token revoked', 401);

  const tokens = await issueTokenPair(user); // rotation
  return { user, ...tokens };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
};
