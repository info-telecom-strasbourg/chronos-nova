CREATE TYPE "public"."academic_year" AS ENUM('1A', '2A', '3A');--> statement-breakpoint
ALTER TABLE "internship" ADD COLUMN "academic_year" "academic_year";