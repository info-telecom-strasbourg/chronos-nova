"use server";

import { getInternships } from "@chronos/db/src/queries/internship.query";
import { GetInternshipsParamsValidator } from "@chronos/db/src/validators/internship.validator";

export async function getInternshipsAction(params: object) {
  const safeParams = GetInternshipsParamsValidator.parse(params);
  return getInternships(safeParams);
}
