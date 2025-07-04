ALTER TABLE "Student" RENAME TO "student";--> statement-breakpoint
ALTER TABLE "internship" DROP CONSTRAINT "internship_student_id_Student_id_fk";
--> statement-breakpoint
ALTER TABLE "student" DROP CONSTRAINT "Student_major_alias_major_alias_fk";
--> statement-breakpoint
ALTER TABLE "student" DROP CONSTRAINT "Student_option_alias_option_alias_fk";
--> statement-breakpoint
ALTER TABLE "internship" ADD CONSTRAINT "internship_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_major_alias_major_alias_fk" FOREIGN KEY ("major_alias") REFERENCES "public"."major"("alias") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_option_alias_option_alias_fk" FOREIGN KEY ("option_alias") REFERENCES "public"."option"("alias") ON DELETE cascade ON UPDATE no action;