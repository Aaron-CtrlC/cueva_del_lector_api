import { index, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { updateTimestamps } from "../columns.helpers";
import { chaptersTable } from "./chapters.table";
import { usersTable } from "./users.table";
import { worksTable } from "./works.table";

export const readingProgressTable = pgTable(
  "reading_progress",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    work_id: uuid("work_id")
      .notNull()
      .references(() => worksTable.id, { onDelete: "cascade" }),
    chapter_id: uuid("chapter_id")
      .notNull()
      .references(() => chaptersTable.id, { onDelete: "cascade" }),
    chapter_position: integer("chapter_position").default(0).notNull(),
    ...updateTimestamps,
  },
  (t) => [
    primaryKey({ name: "pk_reading_progress", columns: [t.user_id, t.work_id] }),
    index("idx_reading_progress_work_id").on(t.work_id),
    index("idx_reading_progress_chapter_id").on(t.chapter_id),
  ],
);
