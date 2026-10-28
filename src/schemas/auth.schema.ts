import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters"),
  email: z.string().trim().email("Invalid email format").toLowerCase(),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .max(72, "Password must have at most 72 characters"),
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().nullable().optional(),
  }),
});

export const userProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
