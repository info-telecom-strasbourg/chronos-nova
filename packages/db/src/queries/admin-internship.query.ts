import { and, asc, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "..";
import { internships as internshipsTable } from "../schema";
import type {
  GetAdminInternshipsParams,
  InternshipFormData,
} from "../validators/admin-internship.validator";

export type Internship = typeof internshipsTable.$inferSelect;

function buildAdminWhere(
  params: Omit<GetAdminInternshipsParams, "page" | "limit">,
) {
  const filters = [];
  if (params.status) {
    filters.push(eq(internshipsTable.status, params.status));
  }
  if (params.q) {
    filters.push(
      or(
        ilike(internshipsTable.subject, `%${params.q}%`),
        ilike(internshipsTable.organizationName, `%${params.q}%`),
        ilike(internshipsTable.city, `%${params.q}%`),
        ilike(internshipsTable.country, `%${params.q}%`),
      ),
    );
  }
  if (params.years?.length)
    filters.push(
      inArray(
        internshipsTable.academicYear,
        params.years as ("1A" | "2A" | "3A")[],
      ),
    );
  if (params.majors?.length)
    filters.push(inArray(internshipsTable.major, params.majors));
  if (params.options?.length)
    filters.push(inArray(internshipsTable.option, params.options));
  if (params.countries?.length)
    filters.push(inArray(internshipsTable.country, params.countries));
  if (params.cities?.length)
    filters.push(inArray(internshipsTable.city, params.cities));
  if (params.orgTypes?.length)
    filters.push(
      inArray(
        internshipsTable.organizationType,
        params.orgTypes as ("company" | "not_company")[],
      ),
    );
  return filters.length > 0 ? and(...filters) : undefined;
}

export async function getAdminInternshipFilterOptions(
  status?: "visible" | "pending" | "deleted",
) {
  const statusFilter = status ? eq(internshipsTable.status, status) : undefined;

  const distinct = (
    // biome-ignore lint/suspicious/noExplicitAny: mixed drizzle column types
    column: any,
  ): Promise<string[]> =>
    db
      .selectDistinct({ value: column })
      .from(internshipsTable)
      .where(statusFilter)
      .then((rows: { value: unknown }[]) =>
        rows
          .map((r) => r.value)
          .filter((v): v is string => typeof v === "string" && v.length > 0)
          .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })),
      );

  const [academicYears, majors, options, countries, cities, organizationTypes] =
    await Promise.all([
      distinct(internshipsTable.academicYear),
      distinct(internshipsTable.major),
      distinct(internshipsTable.option),
      distinct(internshipsTable.country),
      distinct(internshipsTable.city),
      distinct(internshipsTable.organizationType),
    ]);

  return {
    academicYears,
    majors,
    options,
    countries,
    cities,
    organizationTypes,
  };
}

const SORT_COLUMNS = {
  subject: internshipsTable.subject,
  organization: internshipsTable.organizationName,
  academicYear: internshipsTable.academicYear,
  country: internshipsTable.country,
  beginDate: internshipsTable.beginDate,
} as const;

export async function getAdminInternships({
  q,
  status,
  page,
  limit,
  years,
  majors,
  options,
  countries,
  cities,
  orgTypes,
  sortField,
  sortDir,
}: GetAdminInternshipsParams) {
  const offset = page * limit;
  const where = buildAdminWhere({
    q,
    status,
    years,
    majors,
    options,
    countries,
    cities,
    orgTypes,
  });

  const orderCol = sortField
    ? SORT_COLUMNS[sortField]
    : internshipsTable.createdAt;
  const order = sortDir === "desc" ? desc(orderCol) : asc(orderCol);

  const [data, [totalRes]] = await db.transaction(async (tx) => {
    const data = await tx
      .select()
      .from(internshipsTable)
      .where(where)
      .orderBy(order)
      .limit(limit)
      .offset(offset);
    const total = await tx
      .select({ total: count() })
      .from(internshipsTable)
      .where(where);
    return [data, total] as const;
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalRes?.total ?? 0,
      totalPages: Math.ceil((totalRes?.total ?? 0) / limit),
    },
  };
}

export async function getAdminInternshipCounts() {
  const [visible, pending, deleted] = await Promise.all([
    db
      .select({ total: count() })
      .from(internshipsTable)
      .where(eq(internshipsTable.status, "visible"))
      .then((r) => r[0]?.total ?? 0),
    db
      .select({ total: count() })
      .from(internshipsTable)
      .where(eq(internshipsTable.status, "pending"))
      .then((r) => r[0]?.total ?? 0),
    db
      .select({ total: count() })
      .from(internshipsTable)
      .where(eq(internshipsTable.status, "deleted"))
      .then((r) => r[0]?.total ?? 0),
  ]);
  return { visible, pending, deleted };
}

export async function createInternship(
  data: InternshipFormData & {
    status?: "visible" | "pending";
    issues?: string[];
  },
) {
  const [row] = await db
    .insert(internshipsTable)
    .values({
      subject: data.subject ?? null,
      beginDate: data.beginDate ?? null,
      endDate: data.endDate ?? null,
      weeksCount: data.weeksCount ?? null,
      major: data.major ?? null,
      option: data.option ?? null,
      academicYear: data.academicYear ?? null,
      organizationName: data.organizationName ?? null,
      organizationType: data.organizationType ?? null,
      country: data.country ?? null,
      city: data.city ?? null,
      status: data.status ?? "pending",
      issues: data.issues ?? [],
    })
    .returning();
  return row;
}

export async function updateInternship(id: string, data: InternshipFormData) {
  const [row] = await db
    .update(internshipsTable)
    .set({
      subject: data.subject ?? null,
      beginDate: data.beginDate ?? null,
      endDate: data.endDate ?? null,
      weeksCount: data.weeksCount ?? null,
      major: data.major ?? null,
      option: data.option ?? null,
      academicYear: data.academicYear ?? null,
      organizationName: data.organizationName ?? null,
      organizationType: data.organizationType ?? null,
      country: data.country ?? null,
      city: data.city ?? null,
    })
    .where(eq(internshipsTable.id, id))
    .returning();
  return row;
}

export async function updateInternshipStatus(
  id: string,
  status: "visible" | "pending" | "deleted",
) {
  const [row] = await db
    .update(internshipsTable)
    .set({ status })
    .where(eq(internshipsTable.id, id))
    .returning();
  return row;
}

export async function bulkApproveInternships(ids: string[]) {
  if (ids.length === 0) return [];
  return db
    .update(internshipsTable)
    .set({ status: "visible" })
    .where(inArray(internshipsTable.id, ids))
    .returning();
}

export async function deleteInternship(id: string) {
  const [row] = await db
    .update(internshipsTable)
    .set({ status: "deleted" })
    .where(eq(internshipsTable.id, id))
    .returning();
  return row;
}

export async function hardDeleteInternship(id: string) {
  const [row] = await db
    .delete(internshipsTable)
    .where(eq(internshipsTable.id, id))
    .returning();
  return row;
}
