import { NotFoundError } from "../../shared/errors";
import { usersQueries, type UserRow } from "./users.queries";

export function toPublicUser(user: UserRow) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    bio: user.bio,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

export function toPrivateUser(user: UserRow) {
  return {
    ...toPublicUser(user),
    email: user.email,
  };
}

export const usersService = {
  async getById(id: string): Promise<UserRow> {
    const user = await usersQueries.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },
};
