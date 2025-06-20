import { createEnv } from "@t3-oss/env-nextjs";

export const serverEnv = createEnv({
  server: {},
  client: {},
  experimental__runtimeEnv: process.env,
});
