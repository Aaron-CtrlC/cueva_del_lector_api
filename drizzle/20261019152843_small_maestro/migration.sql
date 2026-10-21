CREATE TYPE "report_status" AS ENUM('pending', 'reviewed', 'actioned', 'dismissed');--> statement-breakpoint
CREATE TYPE "report_target" AS ENUM('work', 'chapter', 'comment');--> statement-breakpoint
CREATE TYPE "tag_type" AS ENUM('fandom', 'relationship', 'character', 'additional', 'genre');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('reader', 'author', 'moderator', 'admin');--> statement-breakpoint
CREATE TYPE "user_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "visibility" AS ENUM('draft', 'public', 'private', 'unlisted');--> statement-breakpoint
CREATE TYPE "work_rating" AS ENUM('G', 'PG', 'T', 'M', 'E', 'NA');--> statement-breakpoint
CREATE TYPE "work_status" AS ENUM('ongoing', 'completed', 'hiatus');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" varchar(30) NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'reader'::"user_role" NOT NULL,
	"status" "user_status" DEFAULT 'active'::"user_status" NOT NULL,
	"bio" text,
	"avatar_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"synopsis" text NOT NULL,
	"cover_url" varchar(500),
	"rating" "work_rating" DEFAULT 'NA'::"work_rating" NOT NULL,
	"status" "work_status" DEFAULT 'ongoing'::"work_status" NOT NULL,
	"language" varchar(10) DEFAULT 'es' NOT NULL,
	"mature" boolean DEFAULT false NOT NULL,
	"visibility" "visibility" DEFAULT 'draft'::"visibility" NOT NULL,
	"words_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"work_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"visibility" "visibility" DEFAULT 'draft'::"visibility" NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uq_chapters_work_position" UNIQUE("work_id","position")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"type" "tag_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_tags_type_name" UNIQUE("type","name")
);
--> statement-breakpoint
CREATE TABLE "work_tags" (
	"work_id" uuid,
	"tag_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_work_tags" PRIMARY KEY("work_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"user_id" uuid,
	"work_id" uuid,
	"note" text,
	"is_private" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_bookmarks" PRIMARY KEY("user_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "reading_progress" (
	"user_id" uuid,
	"work_id" uuid,
	"chapter_id" uuid NOT NULL,
	"chapter_position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_reading_progress" PRIMARY KEY("user_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "kudos" (
	"user_id" uuid,
	"work_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_kudos" PRIMARY KEY("user_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"chapter_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"parent_id" uuid,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_follows" (
	"user_id" uuid,
	"work_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_work_follows" PRIMARY KEY("user_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "user_follows" (
	"follower_id" uuid,
	"followee_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pk_user_follows" PRIMARY KEY("follower_id","followee_id"),
	CONSTRAINT "chk_user_follows_not_self" CHECK ("follower_id" <> "followee_id")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"reporter_id" uuid NOT NULL,
	"target_type" "report_target" NOT NULL,
	"work_id" uuid,
	"chapter_id" uuid,
	"comment_id" uuid,
	"reason" text NOT NULL,
	"status" "report_status" DEFAULT 'pending'::"report_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_reports_target" CHECK ((
        ("target_type" = 'work' AND "work_id" IS NOT NULL AND "chapter_id" IS NULL AND "comment_id" IS NULL) OR
        ("target_type" = 'chapter' AND "chapter_id" IS NOT NULL AND "work_id" IS NULL AND "comment_id" IS NULL) OR
        ("target_type" = 'comment' AND "comment_id" IS NOT NULL AND "work_id" IS NULL AND "chapter_id" IS NULL)
      ))
);
--> statement-breakpoint
CREATE INDEX "idx_works_user_id" ON "works" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_works_visibility_published_at" ON "works" ("visibility","published_at");--> statement-breakpoint
CREATE INDEX "idx_work_tags_tag_id" ON "work_tags" ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_work_id" ON "bookmarks" ("work_id");--> statement-breakpoint
CREATE INDEX "idx_reading_progress_work_id" ON "reading_progress" ("work_id");--> statement-breakpoint
CREATE INDEX "idx_reading_progress_chapter_id" ON "reading_progress" ("chapter_id");--> statement-breakpoint
CREATE INDEX "idx_kudos_work_id" ON "kudos" ("work_id");--> statement-breakpoint
CREATE INDEX "idx_comments_chapter_id" ON "comments" ("chapter_id");--> statement-breakpoint
CREATE INDEX "idx_comments_parent_id" ON "comments" ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_comments_user_id" ON "comments" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_work_follows_work_id" ON "work_follows" ("work_id");--> statement-breakpoint
CREATE INDEX "idx_user_follows_followee_id" ON "user_follows" ("followee_id");--> statement-breakpoint
CREATE INDEX "idx_reports_reporter_id" ON "reports" ("reporter_id");--> statement-breakpoint
CREATE INDEX "idx_reports_status" ON "reports" ("status");--> statement-breakpoint
CREATE INDEX "idx_reports_work_id" ON "reports" ("work_id") WHERE "work_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_reports_chapter_id" ON "reports" ("chapter_id") WHERE "chapter_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_reports_comment_id" ON "reports" ("comment_id") WHERE "comment_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_work_id_works_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_tags" ADD CONSTRAINT "work_tags_work_id_works_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_tags" ADD CONSTRAINT "work_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_work_id_works_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_work_id_works_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_chapter_id_chapters_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "kudos" ADD CONSTRAINT "kudos_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "kudos" ADD CONSTRAINT "kudos_work_id_works_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_chapter_id_chapters_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_follows" ADD CONSTRAINT "work_follows_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_follows" ADD CONSTRAINT "work_follows_work_id_works_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followee_id_users_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE;