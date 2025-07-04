import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Configuration de la base de données pour Next.js
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/chronos_nova";

// Création du client postgres
const client = postgres(connectionString, {
  max: 1, // Limite les connexions pour Next.js
});

// Création de l'instance Drizzle
export const db = drizzle(client);

// Export du client pour pouvoir fermer la connexion si nécessaire
export { client };
