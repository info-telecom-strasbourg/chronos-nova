CREATE TYPE "public"."organization_type" AS ENUM('company', 'not_company');--> statement-breakpoint
CREATE TYPE "public"."degree" AS ENUM('gene', 'ir', 'ti');--> statement-breakpoint
CREATE TABLE "internship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" text NOT NULL,
	"confidential" boolean NOT NULL,
	"begin_date" date NOT NULL,
	"period" integer NOT NULL,
	"year" text NOT NULL,
	"student_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major" (
	"alias" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "option" (
	"alias" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "organization_type" NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"major_alias" text NOT NULL,
	"option_alias" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "internship" ADD CONSTRAINT "internship_student_id_Student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internship" ADD CONSTRAINT "internship_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Student" ADD CONSTRAINT "Student_major_alias_major_alias_fk" FOREIGN KEY ("major_alias") REFERENCES "public"."major"("alias") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Student" ADD CONSTRAINT "Student_option_alias_option_alias_fk" FOREIGN KEY ("option_alias") REFERENCES "public"."option"("alias") ON DELETE cascade ON UPDATE no action;