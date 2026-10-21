import { timestamp } from "drizzle-orm/pg-core";

const now = () => new Date();

/**
 * Full timestamps for soft-deletable content tables
 * (created + auto-updated + soft delete).
 */
export const timestamps = {
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(now),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
};

/** created_at + updated_at for tables without soft delete. */
export const updateTimestamps = {
  created_at: timestamps.created_at,
  updated_at: timestamps.updated_at,
};

/** created_at only — junction / assertion tables. */
export const createTimestamps = {
  created_at: timestamps.created_at,
};
