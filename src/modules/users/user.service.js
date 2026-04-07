import User from './user.model.js';
import AppError from '../../utils/AppError.js';

export const createUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new AppError('Email already in use', 409);
  const user = await User.create(data);
  return user;
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const getUserByEmail = (email, { withSecrets = false } = {}) => {
  const query = User.findOne({ email });
  if (withSecrets) query.select('+password +refreshTokenHash');
  return query;
};

export const listUsers = async ({ page = 1, limit = 20, search } = {}) => {
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const updateUser = async (id, updates) => {
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};
