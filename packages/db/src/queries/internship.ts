import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "../index";
import { internships } from "../schema/internship";
import { organizations } from "../schema/organization";
import { students } from "../schema/student";

export type GetInternshipsParams = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: "most-recent" | "organization" | "duration" | "location";
  order?: "asc" | "desc";
  academicYear?: "1A" | "2A" | "3A";
  major?: string;
  option?: string;
  country?: string;
};

export type GetInternshipsResponse = {
  data: InternshipWithRelations[];
  total: number;
  hasMore: boolean;
  nextPage?: number;
};

export type InternshipWithRelations = typeof internships.$inferSelect & {
  organization: typeof organizations.$inferSelect;
  student: typeof students.$inferSelect & {
    major: { alias: string; name: string | null } | null;
    option: { alias: string; name: string | null } | null;
  };
};

export async function getInternships({
  q,
  page = 0,
  limit = 10,
  sort = "most-recent",
  order = "asc",
  academicYear,
  major,
  option,
  country,
}: GetInternshipsParams = {}): Promise<GetInternshipsResponse> {
  const offset = page * limit;

  const conditions = [eq(internships.isInvalid, false)];

  if (academicYear) {
    conditions.push(eq(internships.academicYear, academicYear));
  }

  if (major) {
    conditions.push(eq(students.majorAlias, major));
  }

  if (option) {
    conditions.push(eq(students.optionAlias, option));
  }

  if (country) {
    conditions.push(ilike(organizations.country, country));
  }

  if (q && q.length >= 2) {
    const searchPattern = `%${q}%`;
    const searchCondition = or(
      ilike(organizations.name, searchPattern),
      ilike(internships.subject, searchPattern),
    );
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const whereClause = and(...conditions);

  const orderFn = order === "desc" ? desc : asc;

  let orderByClause: SQL;
  switch (sort) {
    case "organization":
      orderByClause = orderFn(organizations.name);
      break;
    case "duration":
      orderByClause = orderFn(internships.weeksCount);
      break;
    case "location":
      orderByClause = orderFn(organizations.country);
      break;
    default:
      orderByClause = orderFn(internships.beginDate);
      break;
  }

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(internships)
      .innerJoin(
        organizations,
        eq(internships.organizationId, organizations.id),
      )
      .innerJoin(students, eq(internships.studentId, students.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(internships)
      .innerJoin(
        organizations,
        eq(internships.organizationId, organizations.id),
      )
      .innerJoin(students, eq(internships.studentId, students.id))
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;

  const enrichedData = await Promise.all(
    data.map(async (row) => {
      const studentWithRelations = await db.query.students.findFirst({
        where: eq(students.id, row.student.id),
        with: { major: true, option: true },
      });

      return {
        ...row.internship,
        organization: row.organization,
        student: {
          ...row.student,
          major: studentWithRelations?.major ?? null,
          option: studentWithRelations?.option ?? null,
        },
      } satisfies InternshipWithRelations;
    }),
  );

  return {
    data: enrichedData,
    total,
    hasMore: offset + limit < total,
    nextPage: offset + limit < total ? page + 1 : undefined,
  };
}
