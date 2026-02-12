import * as t from "drizzle-orm/pg-core";

export const organizationType = t.pgEnum("organization_type", [
  "company",
  "not_company",
]);

export const academicYear = t.pgEnum("academic_year", ["1A", "2A", "3A"]);
