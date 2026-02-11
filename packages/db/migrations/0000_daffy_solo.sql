CREATE TYPE "public"."academic_year" AS ENUM('1A', '2A', '3A');--> statement-breakpoint
CREATE TYPE "public"."state" AS ENUM('visible', 'draft', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('company', 'not_company');--> statement-breakpoint
CREATE TYPE "public"."degree" AS ENUM('gene', 'ir', 'ti');--> statement-breakpoint
CREATE TABLE "internship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" text,
	"beginDate" date,
	"weeksCount" integer,
	"academicYear" "academic_year",
	"state" "state" NOT NULL,
	"internshipHash" text,
	"isInvalid" boolean DEFAULT false NOT NULL,
	"studentId" uuid NOT NULL,
	"organizationId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major" (
	"alias" text PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "option" (
	"alias" text PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"type" "organization_type",
	"country" text,
	"city" text
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"majorAlias" text,
	"optionAlias" text
);
--> statement-breakpoint
ALTER TABLE "internship" ADD CONSTRAINT "internship_studentId_student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internship" ADD CONSTRAINT "internship_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_majorAlias_major_alias_fk" FOREIGN KEY ("majorAlias") REFERENCES "public"."major"("alias") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_optionAlias_option_alias_fk" FOREIGN KEY ("optionAlias") REFERENCES "public"."option"("alias") ON DELETE set null ON UPDATE no action;