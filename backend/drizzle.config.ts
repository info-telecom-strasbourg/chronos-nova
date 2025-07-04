import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false }, // Ajoute cette ligne
  },
});
