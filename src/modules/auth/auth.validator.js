import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
});
