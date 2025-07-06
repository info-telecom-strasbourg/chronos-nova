import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { major2str, option2str } from "@/lib/const/major-correspondance";
import { serverEnv } from "@/lib/env/server";
import * as schema from "./schema";

async function main() {
  const db = drizzle(serverEnv.SUPABASE_DB_URL, { logger: true });

  await reset(db, schema);
  await seed(db, schema).refine((f) => ({
    internships: {
      count: 100,
      columns: {
        weeksCount: f.valuesFromArray({ values: ["4", "6", "8", "12"] }),
      },
    },
    students: {
      count: 100,
    },
    organizations: {
      count: 60,
    },
    majors: {
      count: Object.keys(major2str).length,
      columns: {
        alias: f.valuesFromArray({ values: Object.keys(major2str) }),
        name: f.valuesFromArray({ values: Object.values(major2str) }),
      },
    },
    options: {
      count: Object.keys(option2str).length,
      columns: {
        alias: f.valuesFromArray({ values: Object.keys(option2str) }),
        name: f.valuesFromArray({ values: Object.values(option2str) }),
      },
    },
  }));
}

main();
