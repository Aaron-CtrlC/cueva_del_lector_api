import { defineRelations } from "drizzle-orm";
import { bookmarksTable } from "./schemas/bookmarks.table";
import { chaptersTable } from "./schemas/chapters.table";
import { commentsTable } from "./schemas/comments.table";
import { kudosTable } from "./schemas/kudos.table";
import { readingProgressTable } from "./schemas/reading-progress.table";
import { reportsTable } from "./schemas/reports.table";
import { tagsTable } from "./schemas/tags.table";
import { userFollowsTable } from "./schemas/user-follows.table";
import { usersTable } from "./schemas/users.table";
import { workFollowsTable } from "./schemas/work-follows.table";
import { workTagsTable } from "./schemas/work-tags.table";
import { worksTable } from "./schemas/works.table";

/** Map of every table — use it to seed the relational query API. */
export const schemaMap = {
  usersTable,
  worksTable,
  chaptersTable,
  tagsTable,
  workTagsTable,
  bookmarksTable,
  readingProgressTable,
  kudosTable,
  commentsTable,
  workFollowsTable,
  userFollowsTable,
  reportsTable,
};

export const relations = defineRelations(schemaMap, (r) => ({
  usersTable: {
    works: r.many.worksTable({
      from: r.usersTable.id,
      to: r.worksTable.user_id,
    }),
    comments: r.many.commentsTable({
      from: r.usersTable.id,
      to: r.commentsTable.user_id,
    }),
    bookmarks: r.many.bookmarksTable({
      from: r.usersTable.id,
      to: r.bookmarksTable.user_id,
    }),
    kudos: r.many.kudosTable({
      from: r.usersTable.id,
      to: r.kudosTable.user_id,
    }),
    reading_progress: r.many.readingProgressTable({
      from: r.usersTable.id,
      to: r.readingProgressTable.user_id,
    }),
    reports: r.many.reportsTable({
      from: r.usersTable.id,
      to: r.reportsTable.reporter_id,
    }),
    following: r.many.userFollowsTable({
      from: r.usersTable.id,
      to: r.userFollowsTable.follower_id,
      alias: "following",
    }),
    followers: r.many.userFollowsTable({
      from: r.usersTable.id,
      to: r.userFollowsTable.followee_id,
      alias: "followers",
    }),
    followed_works: r.many.workFollowsTable({
      from: r.usersTable.id,
      to: r.workFollowsTable.user_id,
      alias: "followed_works",
    }),
  },
  worksTable: {
    author: r.one.usersTable({
      from: r.worksTable.user_id,
      to: r.usersTable.id,
      optional: false,
    }),
    chapters: r.many.chaptersTable({
      from: r.worksTable.id,
      to: r.chaptersTable.work_id,
    }),
    tags: r.many.tagsTable({
      from: r.worksTable.id.through(r.workTagsTable.work_id),
      to: r.tagsTable.id.through(r.workTagsTable.tag_id),
    }),
    bookmarks: r.many.bookmarksTable({
      from: r.worksTable.id,
      to: r.bookmarksTable.work_id,
    }),
    kudos: r.many.kudosTable({
      from: r.worksTable.id,
      to: r.kudosTable.work_id,
    }),
    reading_progress: r.many.readingProgressTable({
      from: r.worksTable.id,
      to: r.readingProgressTable.work_id,
    }),
    followers: r.many.workFollowsTable({
      from: r.worksTable.id,
      to: r.workFollowsTable.work_id,
    }),
  },
  chaptersTable: {
    work: r.one.worksTable({
      from: r.chaptersTable.work_id,
      to: r.worksTable.id,
      optional: false,
    }),
    comments: r.many.commentsTable({
      from: r.chaptersTable.id,
      to: r.commentsTable.chapter_id,
    }),
  },
  tagsTable: {
    works: r.many.worksTable({
      from: r.tagsTable.id.through(r.workTagsTable.tag_id),
      to: r.worksTable.id.through(r.workTagsTable.work_id),
    }),
  },
  workTagsTable: {
    work: r.one.worksTable({
      from: r.workTagsTable.work_id,
      to: r.worksTable.id,
      optional: false,
    }),
    tag: r.one.tagsTable({
      from: r.workTagsTable.tag_id,
      to: r.tagsTable.id,
      optional: false,
    }),
  },
  bookmarksTable: {
    user: r.one.usersTable({
      from: r.bookmarksTable.user_id,
      to: r.usersTable.id,
      optional: false,
    }),
    work: r.one.worksTable({
      from: r.bookmarksTable.work_id,
      to: r.worksTable.id,
      optional: false,
    }),
  },
  readingProgressTable: {
    user: r.one.usersTable({
      from: r.readingProgressTable.user_id,
      to: r.usersTable.id,
      optional: false,
    }),
    work: r.one.worksTable({
      from: r.readingProgressTable.work_id,
      to: r.worksTable.id,
      optional: false,
    }),
    chapter: r.one.chaptersTable({
      from: r.readingProgressTable.chapter_id,
      to: r.chaptersTable.id,
      optional: false,
    }),
  },
  kudosTable: {
    user: r.one.usersTable({
      from: r.kudosTable.user_id,
      to: r.usersTable.id,
      optional: false,
    }),
    work: r.one.worksTable({
      from: r.kudosTable.work_id,
      to: r.worksTable.id,
      optional: false,
    }),
  },
  commentsTable: {
    chapter: r.one.chaptersTable({
      from: r.commentsTable.chapter_id,
      to: r.chaptersTable.id,
      optional: false,
    }),
    user: r.one.usersTable({
      from: r.commentsTable.user_id,
      to: r.usersTable.id,
      optional: false,
    }),
    parent: r.one.commentsTable({
      from: r.commentsTable.parent_id,
      to: r.commentsTable.id,
      alias: "parent",
    }),
    replies: r.many.commentsTable({
      from: r.commentsTable.id,
      to: r.commentsTable.parent_id,
      alias: "replies",
    }),
  },
  workFollowsTable: {
    user: r.one.usersTable({
      from: r.workFollowsTable.user_id,
      to: r.usersTable.id,
      optional: false,
    }),
    work: r.one.worksTable({
      from: r.workFollowsTable.work_id,
      to: r.worksTable.id,
      optional: false,
    }),
  },
  userFollowsTable: {
    follower: r.one.usersTable({
      from: r.userFollowsTable.follower_id,
      to: r.usersTable.id,
      optional: false,
      alias: "follower",
    }),
    followee: r.one.usersTable({
      from: r.userFollowsTable.followee_id,
      to: r.usersTable.id,
      optional: false,
      alias: "followee",
    }),
  },
  reportsTable: {
    reporter: r.one.usersTable({
      from: r.reportsTable.reporter_id,
      to: r.usersTable.id,
      optional: false,
    }),
    target_work: r.one.worksTable({
      from: r.reportsTable.work_id,
      to: r.worksTable.id,
      optional: true,
    }),
    target_chapter: r.one.chaptersTable({
      from: r.reportsTable.chapter_id,
      to: r.chaptersTable.id,
      optional: true,
    }),
    target_comment: r.one.commentsTable({
      from: r.reportsTable.comment_id,
      to: r.commentsTable.id,
      optional: true,
    }),
  },
}));
