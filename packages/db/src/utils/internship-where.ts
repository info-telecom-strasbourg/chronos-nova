import { and, eq, ilike, or, type SQL } from "drizzle-orm";
import type { GetInternshipsParams } from "../queries/internship.query";
import { internshipsTable } from "../schema/internship";

export function buildInternshipWhere({
  q,
  academicYear,
  major,
  option,
  country,
}: Pick<
  GetInternshipsParams,
  "q" | "academicYear" | "major" | "option" | "country"
>) {
  const conditions: Array<SQL> = [];

  if (academicYear)
    conditions.push(eq(internshipsTable.academicYear, academicYear));
  if (major) conditions.push(eq(internshipsTable.major, major));
  if (option) conditions.push(eq(internshipsTable.option, option));
  if (country) conditions.push(eq(internshipsTable.country, country));
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
