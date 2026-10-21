import { AnyPgColumn, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { chaptersTable } from "./chapters.table";
import { usersTable } from "./users.table";

export const commentsTable = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chapter_id: uuid("chapter_id")
      .notNull()
      .references(() => chaptersTable.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    parent_id: uuid("parent_id").references(
      (): AnyPgColumn => commentsTable.id,
      { onDelete: "cascade" },
    ),
    body: text("body").notNull(),
    ...timestamps,
  },
  (t) => [
    index("idx_comments_chapter_id").on(t.chapter_id),
    index("idx_comments_parent_id").on(t.parent_id),
    index("idx_comments_user_id").on(t.user_id),
  ],
);
