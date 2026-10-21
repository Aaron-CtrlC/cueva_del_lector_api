import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "reader",
  "author",
  "moderator",
  "admin",
]);

export const userStatusEnum = pgEnum("user_status", ["active", "suspended"]);

export const workStatusEnum = pgEnum("work_status", [
  "ongoing",
  "completed",
  "hiatus",
]);

export const workRatingEnum = pgEnum("work_rating", [
  "G",
  "PG",
  "T",
  "M",
  "E",
  "NA",
]);

export const visibilityEnum = pgEnum("visibility", [
  "draft",
  "public",
  "private",
  "unlisted",
]);

export const tagTypeEnum = pgEnum("tag_type", [
  "fandom",
  "relationship",
  "character",
  "additional",
  "genre",
]);

export const reportTargetEnum = pgEnum("report_target", [
  "work",
  "chapter",
  "comment",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "reviewed",
  "actioned",
  "dismissed",
]);
