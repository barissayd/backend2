import * as authService from './auth.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Registered successfully',
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  return ApiResponse.success(res, {
    message: 'Logged in successfully',
    data: result,
  });
});

export const refresh = catchAsync(async (req, res) => {
  const result = await authService.refreshTokens(req.body.refreshToken);
  return ApiResponse.success(res, {
    message: 'Token refreshed',
    data: result,
  });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id);
  return ApiResponse.success(res, { message: 'Logged out' });
});
