/** Mirrors the `user_role` Postgres enum. Kept in shared to avoid importing the db layer. */
export const USER_ROLES = ["reader", "author", "moderator", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}
