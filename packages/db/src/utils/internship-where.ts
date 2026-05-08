import { and, ilike, inArray, isNull, or, type SQL } from "drizzle-orm";
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
    conditions.push(
      or(
        inArray(internshipsTable.academicYear, academicYear),
        isNull(internshipsTable.academicYear),
      ) as SQL,
    );
  if (major?.length)
    conditions.push(
      or(
        inArray(internshipsTable.major, major),
        isNull(internshipsTable.major),
      ) as SQL,
    );
  if (option?.length)
    conditions.push(
      or(
        inArray(internshipsTable.option, option),
        isNull(internshipsTable.option),
      ) as SQL,
    );
  if (country?.length)
    conditions.push(
      or(
        inArray(internshipsTable.country, country),
        isNull(internshipsTable.country),
      ) as SQL,
    );
  if (city?.length)
    conditions.push(
      or(
        inArray(internshipsTable.city, city),
        isNull(internshipsTable.city),
      ) as SQL,
    );
  if (organizationType?.length)
    conditions.push(
      or(
        inArray(internshipsTable.organizationType, organizationType),
        isNull(internshipsTable.organizationType),
      ) as SQL,
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
