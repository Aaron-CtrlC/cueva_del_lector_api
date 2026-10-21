import { boolean, index, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { updateTimestamps } from "../columns.helpers";
import { usersTable } from "./users.table";
import { worksTable } from "./works.table";

export const bookmarksTable = pgTable(
  "bookmarks",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    work_id: uuid("work_id")
      .notNull()
      .references(() => worksTable.id, { onDelete: "cascade" }),
    note: text("note"),
    is_private: boolean("is_private").default(false).notNull(),
    ...updateTimestamps,
  },
  (t) => [
    primaryKey({ name: "pk_bookmarks", columns: [t.user_id, t.work_id] }),
    index("idx_bookmarks_work_id").on(t.work_id),
  ],
);
