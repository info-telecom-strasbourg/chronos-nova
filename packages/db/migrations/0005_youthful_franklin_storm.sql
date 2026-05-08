CREATE TYPE "public"."internship_status" AS ENUM('visible', 'pending', 'deleted');--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "status" "internship_status" DEFAULT 'visible' NOT NULL;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "issues" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;