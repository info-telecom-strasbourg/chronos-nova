import { closeConnection, displayDatabaseSummary, displayFirstInternship } from "./queries.js";

/**
 * Point d'entrée principal de l'application
 * Utilise les fonctions de queries.ts pour afficher les données
 */
async function main() {
  try {
    console.log("🚀 CHRONOS NOVA - Affichage des données");

    // Affiche un résumé de la base
    await displayDatabaseSummary();

    // Affiche les détails du premier stage existant (pas forcément ID 1)
    await displayFirstInternship();

    // Ferme la connexion
    await closeConnection();

    console.log("\n✅ Terminé !");
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

main();
