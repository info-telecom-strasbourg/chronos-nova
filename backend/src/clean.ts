import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { completeTable, internshipsTable, organizationsTable, studentsTable } from "./db/schema.js";

// Charge les variables d'environnement
config({ path: ".env" });

// Configuration de la base de données
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function cleanDatabase() {
  console.log("🧹 Nettoyage complet de la base de données...");

  try {
    // Supprime dans l'ordre inverse des contraintes (relations d'abord)
    await db.delete(completeTable);
    console.log("   → Table Complete vidée");

    await db.delete(internshipsTable);
    console.log("   → Table Internship vidée");

    await db.delete(studentsTable);
    console.log("   → Table Student vidée");

    await db.delete(organizationsTable);
    console.log("   → Table Organization vidée");

    console.log("✅ Base de données nettoyée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    throw error;
  }
}

async function main() {
  try {
    await cleanDatabase();

    // Ferme la connexion
    await client.end();

    console.log("\n🎉 Nettoyage terminé !");
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

main();
