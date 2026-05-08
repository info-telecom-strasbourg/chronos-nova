import fs from "node:fs";
import path from "node:path";
import { db } from "@chronos/db/src/index";
import { internships as internshipsTable } from "@chronos/db/src/schema/index";
import { parse } from "csv-parse/sync";
import { sql } from "drizzle-orm";
import z from "zod";

const ACADEMIC_YEARS = ["1A", "2A", "3A"] as const;
const ORG_TYPES = ["company", "not_company"] as const;

const RowSchema = z.object({
  subject: z
    .string()
    .optional()
    .transform((v) => v || null),
  begin_date: z
    .string()
    .optional()
    .transform((v) => v || null),
  end_date: z
    .string()
    .optional()
    .transform((v) => v || null),
  weeks_count: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null)),
  major: z
    .string()
    .optional()
    .transform((v) => v || null),
  option: z
    .string()
    .optional()
    .transform((v) => v || null),
  academic_year: z
    .string()
    .optional()
    .transform((v) =>
      ACADEMIC_YEARS.includes(v as (typeof ACADEMIC_YEARS)[number])
        ? (v as (typeof ACADEMIC_YEARS)[number])
        : null,
    ),
  organization_name: z
    .string()
    .optional()
    .transform((v) => v || null),
  organization_type: z
    .string()
    .optional()
    .transform((v) =>
      ORG_TYPES.includes(v as (typeof ORG_TYPES)[number])
        ? (v as (typeof ORG_TYPES)[number])
        : null,
    ),
  country: z
    .string()
    .optional()
    .transform((v) => v || null),
  city: z
    .string()
    .optional()
    .transform((v) => v || null),
});

const csvPath = path.resolve(process.argv[2] ?? "../../data/chronos.csv");
const BATCH_SIZE = 500;

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  console.info("Truncating internships table...");
  await db.execute(sql`TRUNCATE TABLE internship RESTART IDENTITY CASCADE`);
  console.info("Table truncated.");

  console.info(`Reading ${csvPath}...`);
  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parse(content, { columns: true, skip_empty_lines: true });

  console.info(`Parsed ${rows.length} rows`);

  const records = rows
    .map((row: unknown, i: number) => {
      const result = RowSchema.safeParse(row);
      if (!result.success) {
        console.warn(
          `Row ${i + 2} invalid:`,
          result.error.flatten().fieldErrors,
        );
        return null;
      }
      return {
        subject: result.data.subject,
        beginDate: result.data.begin_date,
        endDate: result.data.end_date,
        weeksCount: result.data.weeks_count,
        major: result.data.major,
        option: result.data.option,
        academicYear: result.data.academic_year,
        organizationName: result.data.organization_name,
        organizationType: result.data.organization_type,
        country: result.data.country,
        city: result.data.city,
      };
    })
    .filter(Boolean);

  console.info(
    `Inserting ${records.length} records in batches of ${BATCH_SIZE}...`,
  );

  let inserted = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await db.insert(internshipsTable).values(batch);
    inserted += batch.length;
    process.stdout.write(`\r${inserted}/${records.length}`);
  }

  console.info(`\nDone. ${inserted} records inserted.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  if (err.cause) console.error("Cause:", err.cause.message ?? err.cause);
  process.exit(1);
});
