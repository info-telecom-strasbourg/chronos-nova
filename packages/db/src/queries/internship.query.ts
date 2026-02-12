import { count } from "drizzle-orm";
import { db } from "..";
import { internships } from "../schema";
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
}: GetInternshipsParams) {
  const offset = page * limit;
  const whereClause = buildInternshipWhere({
    q,
    academicYear,
    major,
    option,
    country,
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
