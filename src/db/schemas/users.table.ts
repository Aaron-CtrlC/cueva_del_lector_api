import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { userRoleEnum, userStatusEnum } from "../enums";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 30 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("reader").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    bio: text("bio"),
    avatar_url: varchar("avatar_url", { length: 500 }),
    ...timestamps,
  },
);
