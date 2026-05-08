import * as t from "drizzle-orm/pg-core";
import { academicYear, internshipStatus, organizationType } from "./enum";

export const internshipsTable = t.pgTable("internship", {
  id: t.uuid("id").defaultRandom().primaryKey(),
  subject: t.text("subject"),
  beginDate: t.date("begin_date"),
  endDate: t.date("end_date"),
  weeksCount: t.integer("weeks_count"),
  major: t.text("major"),
  option: t.text("option"),
  academicYear: academicYear("academic_year"),
  organizationName: t.text("organization_name"),
  organizationType: organizationType("organization_type"),
  country: t.text("country"),
  city: t.text("city"),
  status: internshipStatus("status").default("visible").notNull(),
  issues: t.jsonb("issues").$type<string[]>().default([]),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});
