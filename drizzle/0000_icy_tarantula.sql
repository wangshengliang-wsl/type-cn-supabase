CREATE TABLE "lesson_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"type" text NOT NULL,
	"en" text NOT NULL,
	"zh" text NOT NULL,
	"py" text NOT NULL,
	"accepted" jsonb NOT NULL,
	"audio" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "lesson_items_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" text NOT NULL,
	"title_en" text NOT NULL,
	"title_zh" text NOT NULL,
	"description_en" text NOT NULL,
	"cover" text NOT NULL,
	"tag" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "lessons_lesson_id_unique" UNIQUE("lesson_id")
);
--> statement-breakpoint
CREATE TABLE "user_item_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"completed" boolean DEFAULT false,
	"attempts" integer DEFAULT 0,
	"correct_attempts" integer DEFAULT 0,
	"last_attempt_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_lesson_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lesson_id" text NOT NULL,
	"completed_items" integer DEFAULT 0,
	"total_items" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"last_studied_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_lessons_completed" integer DEFAULT 0,
	"total_items_completed" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_study_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
