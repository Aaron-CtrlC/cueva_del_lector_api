import type { AuthUser } from "../shared/auth/passport";

declare global {
  namespace Express {
    interface User extends AuthUser {}

    interface Request {
      /** Parsed and validated request data, written by the `validate` middleware. */
      valid: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};
