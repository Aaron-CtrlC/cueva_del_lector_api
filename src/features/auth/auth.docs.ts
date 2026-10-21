import { z } from "zod";
import { registry } from "../../shared/docs/registry";
import { privateUserSchema } from "../users/users.schemas";
import { loginSchema, registerSchema } from "./auth.schemas";

const authResponseSchema = z.object({
  data: z.object({ user: privateUserSchema, token: z.string() }),
});

const meResponseSchema = z.object({
  data: z.object({ user: privateUserSchema }),
});

const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

registry.register("PrivateUser", privateUserSchema);
registry.register("AuthResponse", authResponseSchema);
registry.register("ErrorResponse", errorSchema);

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Register a new account",
  request: {
    body: {
      content: { "application/json": { schema: registerSchema } },
    },
  },
  responses: {
    201: {
      description: "Account created",
      content: { "application/json": { schema: authResponseSchema } },
    },
    409: {
      description: "Email or username already registered",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Log in and receive an access token",
  request: {
    body: {
      content: { "application/json": { schema: loginSchema } },
    },
  },
  responses: {
    200: {
      description: "Authenticated",
      content: { "application/json": { schema: authResponseSchema } },
    },
    401: {
      description: "Invalid credentials",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  summary: "Current authenticated user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Authenticated user",
      content: { "application/json": { schema: meResponseSchema } },
    },
    401: {
      description: "Missing or invalid token",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});
