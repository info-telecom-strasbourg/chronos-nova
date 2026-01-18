import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const database_url = process.env.DATABASE_URL;
if (!database_url) throw Error("DATABASE_URL is not set");

export const db = drizzle(database_url);
