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
      .orderBy(...orderByClause)
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
  const f = {
    q: params.q,
    academicYear: params.academicYear,
    major: params.major,
    option: params.option,
    country: params.country,
    city: params.city,
    organizationType: params.organizationType,
  };

  const distinctStrings = (
    // biome-ignore lint/suspicious/noExplicitAny: mixed drizzle column types
    column: any,
    filters: Parameters<typeof buildInternshipWhere>[0],
  ): Promise<string[]> =>
    db
      .selectDistinct({ value: column })
      .from(internships)
      .where(buildInternshipWhere(filters))
      .then((rows: { value: unknown }[]) =>
        rows
          .map((r) => r.value)
          .filter((v): v is string => typeof v === "string")
          .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })),
      );

  const [
    allMajors,
    availableYears,
    availableMajors,
    allOptions,
    availableOptions,
    allCountries,
    availableCountries,
    allCities,
    availableCities,
    availableOrgTypes,
  ] = await Promise.all([
    // Tous les diplômes existants (sans filtre)
    distinctStrings(internshipsTable.major, {}),
    // Années disponibles (tous filtres sauf année)
    distinctStrings(internshipsTable.academicYear, {
      ...f,
      academicYear: undefined,
    }),
    // Diplômes disponibles (tous filtres sauf diplôme et filière, car filière cascade)
    distinctStrings(internshipsTable.major, {
      ...f,
      major: undefined,
      option: undefined,
    }),
    // Toutes les filières (filtrées par diplôme uniquement)
    distinctStrings(internshipsTable.option, { major: params.major }),
    // Filières disponibles (tous filtres sauf filière)
    distinctStrings(internshipsTable.option, { ...f, option: undefined }),
    // Tous les pays (filtrés par tout sauf pays et ville)
    distinctStrings(internshipsTable.country, {}),
    // Pays disponibles (tous filtres sauf pays et ville)
    distinctStrings(internshipsTable.country, {
      ...f,
      country: undefined,
      city: undefined,
    }),
    // Toutes les villes (sans filtre)
    distinctStrings(internshipsTable.city, {}),
    // Villes disponibles (tous filtres sauf ville)
    distinctStrings(internshipsTable.city, { ...f, city: undefined }),
    // Types disponibles (tous filtres sauf type)
    distinctStrings(internshipsTable.organizationType, {
      ...f,
      organizationType: undefined,
    }),
  ]);

  return {
    academicYears: {
      all: ["1A", "2A", "3A"] as string[],
      available: availableYears,
    },
    majors: { all: allMajors, available: availableMajors },
    options: { all: allOptions, available: availableOptions },
    countries: { all: allCountries, available: availableCountries },
    cities: { all: allCities, available: availableCities },
    organizationTypes: {
      all: ["company", "not_company"] as string[],
      available: availableOrgTypes,
    },
  };
}
