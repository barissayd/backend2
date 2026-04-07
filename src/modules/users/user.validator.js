import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(128),
    role: z.enum(['user', 'admin']).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      name: z.string().min(2).max(80).optional(),
      email: z.string().email().toLowerCase().optional(),
      role: z.enum(['user', 'admin']).optional(),
    })
    .refine((d) => Object.keys(d).length > 0, { message: 'No fields to update' }),
});

export const userIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
  }),
});
