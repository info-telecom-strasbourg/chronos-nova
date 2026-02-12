import z from "zod";

export const GetInternshipsParamsValidator = z.object({
  q: z.string().optional(),
  page: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().default(10),
  sort: z
    .enum(["most-recent", "organization", "duration", "location"])
    .default("most-recent"),
  order: z.enum(["asc", "desc"]).default("asc"),
  academicYear: z.enum(["1A", "2A", "3A"]).optional(),
  major: z.string().optional(),
  option: z.string().optional(),
  country: z.string().optional(),
});

export type GetInternshipsParams = z.infer<
  typeof GetInternshipsParamsValidator
>;
