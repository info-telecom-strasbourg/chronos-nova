import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@/lib/env/server";

export default defineConfig({
  schema: "./backend/schema",
  out: "./backend/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.SUPABASE_DB_URL,
  },
});
