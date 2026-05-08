import { asc, type SQL, sql } from "drizzle-orm";

import { internshipsTable } from "../schema/internship";
import type { GetInternshipsParams } from "../validators/internship.validator";

const DEFAULT_SORT = "most-recent";

const SORT_MAP = {
  "most-recent": internshipsTable.beginDate,
  organization: internshipsTable.organizationName,
  duration: internshipsTable.weeksCount,
  location: internshipsTable.country,
} as const;

export function buildInternshipOrderBy({
  sort,
  order,
}: Pick<GetInternshipsParams, "sort" | "order">): SQL[] {
  const column = SORT_MAP[sort ?? DEFAULT_SORT];
  const direction = order === "desc" ? sql`DESC` : sql`ASC`;

  return [sql`${column} ${direction} NULLS LAST`, asc(internshipsTable.id)];
}
