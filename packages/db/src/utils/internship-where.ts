import { and, ilike, inArray, or, type SQL } from "drizzle-orm";
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

  if (academicYear?.length)
    conditions.push(inArray(internshipsTable.academicYear, academicYear));
  if (major?.length) conditions.push(inArray(internshipsTable.major, major));
  if (option?.length) conditions.push(inArray(internshipsTable.option, option));
  if (country?.length)
    conditions.push(inArray(internshipsTable.country, country));
  if (city?.length) conditions.push(inArray(internshipsTable.city, city));
  if (organizationType?.length)
    conditions.push(
      inArray(internshipsTable.organizationType, organizationType),
    );
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
