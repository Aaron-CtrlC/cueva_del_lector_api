import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { usersTable } from "../../db/schemas/users.table";

export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;

export const usersQueries = {
  async findByEmail(email: string): Promise<UserRow | undefined> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return rows[0];
  },

  async findByUsername(username: string): Promise<UserRow | undefined> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    return rows[0];
  },

  async findById(id: string): Promise<UserRow | undefined> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return rows[0];
  },

  async create(
    data: Pick<NewUserRow, "username" | "email" | "password">,
  ): Promise<UserRow> {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
  },
};
