ALTER TABLE "internship" RENAME COLUMN "year" TO "weeks_duration";--> statement-breakpoint
ALTER TABLE "internship" ALTER COLUMN "subject" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "internship" ALTER COLUMN "confidential" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "internship" ALTER COLUMN "begin_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "internship" DROP COLUMN "period";