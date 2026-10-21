import { sql } from "drizzle-orm";
import { check, index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createTimestamps } from "../columns.helpers";
import { usersTable } from "./users.table";

export const userFollowsTable = pgTable(
  "user_follows",
  {
    follower_id: uuid("follower_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    followee_id: uuid("followee_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    ...createTimestamps,
  },
  (t) => [
    primaryKey({
      name: "pk_user_follows",
      columns: [t.follower_id, t.followee_id],
    }),
    index("idx_user_follows_followee_id").on(t.followee_id),
    check(
      "chk_user_follows_not_self",
      sql`${t.follower_id} <> ${t.followee_id}`,
    ),
  ],
);
