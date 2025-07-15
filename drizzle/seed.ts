import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { serverEnv } from "@/lib/env/server";
import * as schema from "./schema";

const majorValues = ["gene", "ir", "ti-sante"];
const optionValues = [
  "aucune",
  "sdia",
  "rio",
  "ti",
  "dtmi",
  "stq",
  "ispv",
  "issd",
  "isav",
  "photo",
  "pm"
];

async function main() {
  const db = drizzle(serverEnv.SUPABASE_DB_URL, { logger: true });

  await reset(db, schema);
  await seed(db, schema).refine((f) => ({
    internships: {
      count: 100,
      columns: {
        weeksCount: f.valuesFromArray({ values: ["4", "6", "8", "12"] }),
        state: f.default({ defaultValue: "visible" }),
      },
    },
    students: {
      count: 100,
    },
    organizations: {
      count: 60,
    },
    majors: {
      count: majorValues.length,
      columns: {
        alias: f.valuesFromArray({ values: majorValues }),
      },
    },
    options: {
      count: optionValues.length,
      columns: {
        alias: f.valuesFromArray({ values: optionValues }),
      },
    },
  }));
}

main();
