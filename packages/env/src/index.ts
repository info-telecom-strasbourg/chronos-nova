import { config } from "dotenv";
import { expand } from "dotenv-expand";
import z from "zod";
import { EnvSchema } from "./schema";

expand(config());

function getEnv() {
  try {
    // biome-ignore lint/style/noProcessEnv: To avoid having to import process everywhere
    return EnvSchema.parse(process.env);
  } catch (e) {
    const error = e as z.ZodError;
    console.error("❌ Invalid env:");
    console.error(z.flattenError(error).fieldErrors);
    process.exit(1);
  }
}

export const env = getEnv();
