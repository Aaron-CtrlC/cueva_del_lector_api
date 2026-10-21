import { pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { createTimestamps } from "../columns.helpers";
import { tagTypeEnum } from "../enums";

export const tagsTable = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    type: tagTypeEnum("type").notNull(),
    ...createTimestamps,
  },
  (t) => [unique("uq_tags_type_name").on(t.type, t.name)],
);
