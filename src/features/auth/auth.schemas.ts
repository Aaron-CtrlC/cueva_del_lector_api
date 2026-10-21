import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email().max(255);

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),
  email: emailSchema,
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
