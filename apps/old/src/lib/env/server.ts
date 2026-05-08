import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  experimental__runtimeEnv: process.env,
  server: {
    SUPABASE_DB_URL: z.string(),
  },
});
