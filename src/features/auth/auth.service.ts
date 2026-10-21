import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env";
import {
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "../../shared/errors";
import { usersQueries, type UserRow } from "../users/users.queries";
import type { LoginInput, RegisterInput } from "./auth.schemas";

const BCRYPT_COST = 12;

export interface AuthResult {
  user: UserRow;
  token: string;
}

function signToken(user: UserRow): string {
  const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn,
  });
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const [emailTaken, usernameTaken] = await Promise.all([
      usersQueries.findByEmail(input.email),
      usersQueries.findByUsername(input.username),
    ]);

    if (emailTaken) throw new ConflictError("Email is already registered");
    if (usernameTaken) throw new ConflictError("Username is already taken");

    const password = await bcrypt.hash(input.password, BCRYPT_COST);

    try {
      const user = await usersQueries.create({
        username: input.username,
        email: input.email,
        password,
      });
      return { user, token: signToken(user) };
    } catch (error) {
      // Handles the race between the checks above and a concurrent signup.
      if (isUniqueViolation(error)) {
        throw new ConflictError("Email or username is already registered");
      }
      throw error;
    }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await usersQueries.findByEmail(input.email);

    if (!user) throw new UnauthorizedError("Invalid email or password");
    if (user.status !== "active") {
      throw new ForbiddenError("Account is suspended");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return { user, token: signToken(user) };
  },
};
