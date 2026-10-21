import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { visibilityEnum } from "../enums";
import { worksTable } from "./works.table";

export const chaptersTable = pgTable(
  "chapters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    work_id: uuid("work_id")
      .notNull()
      .references(() => worksTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    visibility: visibilityEnum("visibility").default("draft").notNull(),
    published_at: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [unique("uq_chapters_work_position").on(t.work_id, t.position)],
);
