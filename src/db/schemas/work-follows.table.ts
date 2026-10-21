import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createTimestamps } from "../columns.helpers";
import { usersTable } from "./users.table";
import { worksTable } from "./works.table";

export const workFollowsTable = pgTable(
  "work_follows",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    work_id: uuid("work_id")
      .notNull()
      .references(() => worksTable.id, { onDelete: "cascade" }),
    ...createTimestamps,
  },
  (t) => [
    primaryKey({ name: "pk_work_follows", columns: [t.user_id, t.work_id] }),
    index("idx_work_follows_work_id").on(t.work_id),
  ],
);
