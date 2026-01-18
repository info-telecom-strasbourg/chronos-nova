import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const database_url = process.env.DATABASE_URL;
if (!database_url) throw Error("DATABASE_URL is not set");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: database_url,
  },
});
