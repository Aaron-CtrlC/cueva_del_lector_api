import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createTimestamps } from "../columns.helpers";
import { usersTable } from "./users.table";
import { worksTable } from "./works.table";

export const kudosTable = pgTable(
  "kudos",
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
    primaryKey({ name: "pk_kudos", columns: [t.user_id, t.work_id] }),
    index("idx_kudos_work_id").on(t.work_id),
  ],
);
