import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env" }); // or .env.local

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);
