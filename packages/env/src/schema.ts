import z from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
});
