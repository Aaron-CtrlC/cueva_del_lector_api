import { check, index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { updateTimestamps } from "../columns.helpers";
import { reportStatusEnum, reportTargetEnum } from "../enums";
import { usersTable } from "./users.table";

export const reportsTable = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reporter_id: uuid("reporter_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    target_type: reportTargetEnum("target_type").notNull(),
    work_id: uuid("work_id"),
    chapter_id: uuid("chapter_id"),
    comment_id: uuid("comment_id"),
    reason: text("reason").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    ...updateTimestamps,
  },
  (t) => [
    index("idx_reports_reporter_id").on(t.reporter_id),
    index("idx_reports_status").on(t.status),
    index("idx_reports_work_id")
      .on(t.work_id)
      .where(sql`${t.work_id} IS NOT NULL`),
    index("idx_reports_chapter_id")
      .on(t.chapter_id)
      .where(sql`${t.chapter_id} IS NOT NULL`),
    index("idx_reports_comment_id")
      .on(t.comment_id)
      .where(sql`${t.comment_id} IS NOT NULL`),
    check(
      "chk_reports_target",
      sql`(
        (${t.target_type} = 'work' AND ${t.work_id} IS NOT NULL AND ${t.chapter_id} IS NULL AND ${t.comment_id} IS NULL) OR
        (${t.target_type} = 'chapter' AND ${t.chapter_id} IS NOT NULL AND ${t.work_id} IS NULL AND ${t.comment_id} IS NULL) OR
        (${t.target_type} = 'comment' AND ${t.comment_id} IS NOT NULL AND ${t.work_id} IS NULL AND ${t.chapter_id} IS NULL)
      )`,
    ),
  ],
);
