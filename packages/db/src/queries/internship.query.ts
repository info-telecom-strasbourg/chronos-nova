import { count } from "drizzle-orm";
import { db } from "..";
import { internships } from "../schema";
import { internshipsTable } from "../schema/internship";
import { buildInternshipOrderBy } from "../utils/internship-order";
import { buildInternshipWhere } from "../utils/internship-where";
import type { GetInternshipsParams } from "../validators/internship.validator";

export async function getInternships({
  q,
  page,
  limit,
  sort,
  order,
  academicYear,
  major,
  option,
  country,
  city,
  organizationType,
}: GetInternshipsParams) {
  const offset = page * limit;
  const whereClause = buildInternshipWhere({
    q,
    academicYear,
    major,
    option,
    country,
    city,
    organizationType,
  });
  const orderByClause = buildInternshipOrderBy({ sort, order });

  const [data, total] = await db.transaction(async (tx) => {
    const data = await tx
      .select()
      .from(internships)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
    const [totalRes] = await tx
      .select({ total: count() })
      .from(internships)
      .where(whereClause);

    return [data, totalRes?.total ?? 0] as const;
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getInternshipFilterOptions(params: GetInternshipsParams) {
  const baseFilters = {
    q: params.q,
    academicYear: params.academicYear,
    major: params.major,
    option: params.option,
    country: params.country,
    city: params.city,
    organizationType: params.organizationType,
  };

  const [academicYears, majors, options, countries, cities] = await Promise.all(
    [
      db
        .selectDistinct({ value: internshipsTable.academicYear })
        .from(internships)
        .where(
          buildInternshipWhere({
            ...baseFilters,
            academicYear: undefined,
          }),
        )
        .then((rows) =>
          rows
            .map((r) => r.value)
            .filter((v) => v != null)
            .sort(),
        ),
      db
        .selectDistinct({ value: internshipsTable.major })
        .from(internships)
        .where(
          buildInternshipWhere({
            ...baseFilters,
            major: undefined,
          }),
        )
        .then((rows) =>
          rows
            .map((r) => r.value)
            .filter((v): v is string => v != null)
            .sort(),
        ),
      db
        .selectDistinct({ value: internshipsTable.option })
        .from(internships)
        .where(
          buildInternshipWhere({
            ...baseFilters,
            option: undefined,
          }),
        )
        .then((rows) =>
          rows
            .map((r) => r.value)
            .filter((v): v is string => v != null)
            .sort(),
        ),
      db
        .selectDistinct({ value: internshipsTable.country })
        .from(internships)
        .where(
          buildInternshipWhere({
            ...baseFilters,
            country: undefined,
          }),
        )
        .then((rows) =>
          rows
            .map((r) => r.value)
            .filter((v): v is string => v != null)
            .sort(),
        ),
      db
        .selectDistinct({ value: internshipsTable.city })
        .from(internships)
        .where(
          buildInternshipWhere({
            ...baseFilters,
            city: undefined,
          }),
        )
        .then((rows) =>
          rows
            .map((r) => r.value)
            .filter((v): v is string => v != null)
            .sort(),
        ),
    ],
  );

  return { academicYears, majors, options, countries, cities };
}
