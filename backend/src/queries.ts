import { eq } from "drizzle-orm";
import { client, db } from "./db/index.js";
import { completeTable, internshipsTable, organizationsTable, studentsTable } from "./db/schema.js";

/**
 * Affiche les détails du premier stage disponible dans la base
 */
export async function displayFirstInternship() {
  try {
    // Récupère le premier stage disponible
    const firstInternship = await db.select().from(internshipsTable).limit(1);

    if (firstInternship.length === 0) {
      console.log("\n❌ Aucun stage trouvé dans la base de données");
      return;
    }

    // Affiche les détails de ce stage
    await displayInternshipDetails(firstInternship[0].internship_id);
  } catch (error) {
    console.error("❌ Erreur lors de la recherche du premier stage:", error);
  }
}

/**
 * Affiche les détails complets d'un stage avec tous les étudiants assignés
 */
export async function displayInternshipDetails(internshipId: number) {
  console.log(`\n🔍 DÉTAILS COMPLETS DU STAGE ID: ${internshipId}`);
  console.log("=".repeat(60));

  try {
    // Récupère le stage
    const internship = await db
      .select()
      .from(internshipsTable)
      .where(eq(internshipsTable.internship_id, internshipId))
      .limit(1);

    if (internship.length === 0) {
      console.log("❌ Stage non trouvé");
      return;
    }

    const stage = internship[0];
    console.log("\n📋 INFORMATIONS DU STAGE:");
    console.log(`   ID: ${stage.internship_id}`);
    console.log(`   Sujet: ${stage.internship_subject}`);
    console.log(`   Année: ${stage.internship_year}`);
    console.log(`   Date: ${stage.internship_dates}`);
    console.log(`   Durée: ${stage.internship_period} semaines`);
    console.log(`   Confidentiel: ${stage.internship_confidential ? "Oui" : "Non"}`);

    // Récupère tous les étudiants assignés à ce stage
    const studentsData = await db
      .select({
        student: studentsTable,
        organization: organizationsTable,
      })
      .from(completeTable)
      .innerJoin(studentsTable, eq(completeTable.student_id, studentsTable.student_id))
      .innerJoin(
        organizationsTable,
        eq(studentsTable.organization_id, organizationsTable.organization_id),
      )
      .where(eq(completeTable.internship_id, internshipId));

    console.log(`\n👥 ÉTUDIANTS ASSIGNÉS (${studentsData.length}):`);
    if (studentsData.length === 0) {
      console.log("   Aucun étudiant assigné à ce stage");
    } else {
      for (const { student, organization } of studentsData) {
        console.log(`\n   • ${student.student_firstname} ${student.student_lastname}`);
        console.log(`     ID Étudiant: ${student.student_id}`);
        console.log(`     Filière: ${student.student_degree}`);
        console.log(`     Parcours: ${student.student_course}`);
        console.log(`     Organisation: ${organization.organization_name}`);
        console.log(`     Tuteur: ${organization.tutor_firstname} ${organization.tutor_lastname}`);
        console.log(
          `     Lieu: ${organization.organization_city}, ${organization.organization_country}`,
        );
      }
    }

    console.log("\n" + "=".repeat(60));
  } catch (error) {
    console.error("❌ Erreur lors de l'affichage du stage:", error);
  }
}

/**
 * Affiche un résumé de toutes les données
 */
export async function displayDatabaseSummary() {
  console.log("\n📊 RÉSUMÉ DE LA BASE DE DONNÉES");
  console.log("=".repeat(40));

  try {
    const orgCount = await db.select().from(organizationsTable);
    const studCount = await db.select().from(studentsTable);
    const internCount = await db.select().from(internshipsTable);
    const completeCount = await db.select().from(completeTable);

    console.log(`🏢 Organisations: ${orgCount.length}`);
    console.log(`👥 Étudiants: ${studCount.length}`);
    console.log(`🎯 Stages: ${internCount.length}`);
    console.log(`🔗 Relations: ${completeCount.length}`);
  } catch (error) {
    console.error("❌ Erreur lors du résumé:", error);
  }
}

/**
 * Ferme la connexion à la base de données
 */
export async function closeConnection() {
  await client.end();
}

// Fonction principale pour exécuter des requêtes
async function main() {
  try {
    await displayDatabaseSummary();
    await displayFirstInternship();
    await closeConnection();
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

// Si ce fichier est exécuté directement
if (import.meta.url === new URL(import.meta.resolve("./queries.js")).href) {
  main();
}
