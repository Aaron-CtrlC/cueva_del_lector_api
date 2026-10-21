import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createTimestamps } from "../columns.helpers";
import { tagsTable } from "./tags.table";
import { worksTable } from "./works.table";

export const workTagsTable = pgTable(
  "work_tags",
  {
    work_id: uuid("work_id")
      .notNull()
      .references(() => worksTable.id, { onDelete: "cascade" }),
    tag_id: uuid("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
    ...createTimestamps,
  },
  (t) => [
    primaryKey({ name: "pk_work_tags", columns: [t.work_id, t.tag_id] }),
    index("idx_work_tags_tag_id").on(t.tag_id),
  ],
);
