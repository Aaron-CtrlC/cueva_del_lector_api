import type { RequestHandler } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { passport, type AuthUser } from "./passport";
import type { UserRole } from "./roles";

export const requireAuth: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: AuthUser | false | null) => {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        next(new UnauthorizedError());
        return;
      }
      req.user = user;
      next();
    },
  )(req, res, next);
};

export const optionalAuth: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: AuthUser | false | null) => {
      if (err) {
        next(err);
        return;
      }
      if (user) req.user = user;
      next();
    },
  )(req, res, next);
};

/** Must run after `requireAuth` (or any middleware that sets `req.user`). */
export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}
