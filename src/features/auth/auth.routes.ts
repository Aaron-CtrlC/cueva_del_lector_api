import { Router } from "express";
import { requireAuth } from "../../shared/auth/guards";
import { asyncHandler } from "../../shared/http/async-handler";
import { validate } from "../../shared/http/validate";
import { toPrivateUser, usersService } from "../users/users.service";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "./auth.schemas";
import { authService } from "./auth.service";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(async (req, res) => {
    const { user, token } = await authService.register(
      req.valid.body as RegisterInput,
    );
    res.status(201).json({ data: { user: toPrivateUser(user), token } });
  }),
);

authRouter.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const { user, token } = await authService.login(
      req.valid.body as LoginInput,
    );
    res.json({ data: { user: toPrivateUser(user), token } });
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await usersService.getById(req.user!.id);
    res.json({ data: { user: toPrivateUser(user) } });
  }),
);
