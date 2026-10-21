import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { visibilityEnum, workRatingEnum, workStatusEnum } from "../enums";
import { usersTable } from "./users.table";

export const worksTable = pgTable(
  "works",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    synopsis: text("synopsis").notNull(),
    cover_url: varchar("cover_url", { length: 500 }),
    rating: workRatingEnum("rating").default("NA").notNull(),
    status: workStatusEnum("status").default("ongoing").notNull(),
    language: varchar("language", { length: 10 }).default("es").notNull(),
    mature: boolean("mature").default(false).notNull(),
    visibility: visibilityEnum("visibility").default("draft").notNull(),
    words_count: integer("words_count").default(0).notNull(),
    published_at: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("idx_works_user_id").on(t.user_id),
    index("idx_works_visibility_published_at").on(t.visibility, t.published_at),
  ],
);
