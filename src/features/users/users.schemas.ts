import { z } from "zod";
import { USER_ROLES } from "../../shared/auth/roles";

/** User representation safe to return to any client (no email, no password). */
export const publicUserSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  role: z.enum(USER_ROLES),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.date(),
});

/** Own-account representation: adds the email. Never includes the password. */
export const privateUserSchema = publicUserSchema.extend({
  email: z.email(),
});
