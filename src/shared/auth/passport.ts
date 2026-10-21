import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { env } from "../config/env";
import { isUserRole, type UserRole } from "./roles";

export interface AuthUser {
  id: string;
  role: UserRole;
}

interface JwtPayload {
  sub?: unknown;
  role?: unknown;
}

/**
 * Access-token-only strategy: verifies signature/expiry and attaches
 * `{ id, role }` to the request. No database round-trip here.
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    },
    (payload: JwtPayload, done) => {
      if (!payload || typeof payload.sub !== "string") {
        return done(null, false);
      }

      const role = isUserRole(payload.role) ? payload.role : "reader";
      return done(null, { id: payload.sub, role });
    },
  ),
);

export { passport };
