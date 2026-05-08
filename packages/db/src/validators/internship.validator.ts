import z from "zod";

export const GetInternshipsParamsValidator = z.object({
  q: z.string().optional(),
  page: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().default(10),
  sort: z
    .enum(["most-recent", "organization", "duration", "location"])
    .default("most-recent"),
  order: z.enum(["asc", "desc"]).default("desc"),
  academicYear: z.array(z.enum(["1A", "2A", "3A"])).optional(),
  major: z.array(z.string()).optional(),
  option: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  city: z.array(z.string()).optional(),
  organizationType: z.array(z.enum(["company", "not_company"])).optional(),
});

export type GetInternshipsParams = z.infer<
  typeof GetInternshipsParamsValidator
>;
