import { asc, desc } from "drizzle-orm";
import type { GetInternshipsParams } from "../queries/internship.query";
import { internshipsTable } from "../schema/internship";

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
}: Pick<GetInternshipsParams, "sort" | "order">) {
  const column = SORT_MAP[sort ?? DEFAULT_SORT];
  const orderFn = order === "desc" ? desc : asc;

  return orderFn(column);
}
