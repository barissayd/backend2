import * as userService from './user.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const create = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'User created',
    data: user,
  });
});

export const list = catchAsync(async (req, res) => {
  const { items, meta } = await userService.listUsers(req.query);
  return ApiResponse.success(res, { data: items, meta });
});

export const getById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return ApiResponse.success(res, { data: user });
});

export const update = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return ApiResponse.success(res, { message: 'User updated', data: user });
});

export const remove = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return ApiResponse.success(res, { message: 'User deleted' });
});
