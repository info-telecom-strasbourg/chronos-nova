import { createEnv } from "@t3-oss/env-nextjs";

export const serverEnv = createEnv({
  experimental__runtimeEnv: process.env,
  server: {},
});
