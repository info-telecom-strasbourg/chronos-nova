import { and, eq, ilike, or, type SQL } from "drizzle-orm";
import { internshipsTable } from "../schema/internship";
import type { GetInternshipsParams } from "../validators/internship.validator";

export function buildInternshipWhere({
  q,
  academicYear,
  major,
  option,
  country,
  city,
  organizationType,
}: Pick<
  GetInternshipsParams,
  | "q"
  | "academicYear"
  | "major"
  | "option"
  | "country"
  | "city"
  | "organizationType"
>) {
  const conditions: Array<SQL> = [];

  if (academicYear)
    conditions.push(eq(internshipsTable.academicYear, academicYear));
  if (major) conditions.push(eq(internshipsTable.major, major));
  if (option) conditions.push(eq(internshipsTable.option, option));
  if (country) conditions.push(eq(internshipsTable.country, country));
  if (city) conditions.push(eq(internshipsTable.city, city));
  if (organizationType)
    conditions.push(eq(internshipsTable.organizationType, organizationType));
  if (q && q.length > 2) conditions.push(buildQueryCondition(q));

  return and(...conditions);
}

function buildQueryCondition(q: string) {
  const pattern = `%${q}%`;
  return or(
    ilike(internshipsTable.subject, pattern),
    ilike(internshipsTable.organizationName, pattern),
  ) as SQL;
}
