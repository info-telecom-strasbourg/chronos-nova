ALTER TABLE "major" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "option" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "student" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "major" CASCADE;--> statement-breakpoint
DROP TABLE "option" CASCADE;--> statement-breakpoint
DROP TABLE "organization" CASCADE;--> statement-breakpoint
DROP TABLE "student" CASCADE;--> statement-breakpoint
ALTER TABLE "internship" RENAME COLUMN "weeksCount" TO "begin_date";--> statement-breakpoint
ALTER TABLE "internship" DROP CONSTRAINT "internship_studentId_student_id_fk";
--> statement-breakpoint
ALTER TABLE "internship" DROP CONSTRAINT "internship_organizationId_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "weeks_count" integer;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "major" text;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "option" text;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "organization_name" text;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "organization_type" "organization_type";--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "internship" DROP COLUMN "beginDate";--> statement-breakpoint
ALTER TABLE "internship" DROP COLUMN "isInvalid";--> statement-breakpoint
ALTER TABLE "internship" DROP COLUMN "studentId";--> statement-breakpoint
ALTER TABLE "internship" DROP COLUMN "organizationId";--> statement-breakpoint
DROP TYPE "public"."state";--> statement-breakpoint
DROP TYPE "public"."degree";