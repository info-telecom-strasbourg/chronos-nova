import { faker } from "@faker-js/faker";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { completeTable, internshipsTable, organizationsTable, studentsTable } from "./db/schema.js";
import { formatDateFR } from "./utils.js";

// Charge les variables d'environnement
config({ path: ".env" });

// Configuration de la base de données
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

// Seed fixe pour avoir des données reproductibles
faker.seed(12345);

// Nombre d'éléments à générer
const N_ORG = 5;
const N_STUD = 8;
const N_COMPLETE = 8;

async function cleanDatabase() {
  try {
    // Supprime dans l'ordre inverse des contraintes (relations d'abord)
    await db.delete(completeTable);
    await db.delete(internshipsTable);
    await db.delete(studentsTable);
    await db.delete(organizationsTable);

    console.log("✅ Base de données nettoyée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    throw error;
  }
}

async function seedOrganizations() {
  const orgs = Array.from({ length: N_ORG }).map(() => ({
    organization_name: faker.company.name(),
    tutor_firstname: faker.person.firstName(),
    tutor_lastname: faker.person.lastName(),
    organization_type: faker.company.buzzPhrase(),
    organization_country: faker.location.country(),
    organization_city: faker.location.city(),
    organization_postal_code: faker.number.int({ min: 10000, max: 99999 }),
  }));

  const result = await db
    .insert(organizationsTable)
    .values(orgs)
    .returning({ id: organizationsTable.organization_id });

  return result.map((row) => row.id);
}

async function seedStudents(orgIds: number[]) {
  const students = Array.from({ length: N_STUD }).map(() => ({
    student_firstname: faker.person.firstName(),
    student_lastname: faker.person.lastName(),
    student_degree: faker.helpers.arrayElement(["Généraliste", "IR", "TI Santé"]),
    student_course: faker.helpers.arrayElement([
      "Informatique",
      "Réseaux",
      "Cybersécurité",
      "IA",
      "Biomédical",
      "E-santé",
      "Développement web",
      "Systèmes embarqués",
      "Data Science",
    ]),
    organization_id: faker.helpers.arrayElement(orgIds),
  }));

  const result = await db
    .insert(studentsTable)
    .values(students)
    .returning({ id: studentsTable.student_id });

  return result.map((row) => row.id);
}

async function seedComplete(studentIds: number[]) {
  const completes = [];
  let lastInternshipId = 0;

  // Sujets de stages réalistes pour l'informatique
  const internshipSubjects = [
    "Développement d'une application mobile de gestion",
    "Sécurisation du réseau informatique de l'entreprise",
    "Analyse de données avec intelligence artificielle",
    "Création d'un chatbot pour le service client",
    "Audit de sécurité des systèmes critiques",
    "Interface web pour téléconsultation médicale",
    "Optimisation des performances d'un site e-commerce",
    "Programmation de capteurs IoT pour la domotique",
    "Migration vers le cloud des services internes",
    "Développement d'une API REST pour mobile",
  ];

  for (let i = 0; i < N_COMPLETE; i++) {
    // Crée un nouveau stage pour chaque relation avec un étudiant unique
    const newInternship = await db
      .insert(internshipsTable)
      .values({
        internship_subject: faker.helpers.arrayElement(internshipSubjects),
        internship_confidential: faker.datatype.boolean(),
        internship_dates: formatDateFR(faker.date.past()),
        internship_period: faker.number.int({ min: 8, max: 24 }),
        internship_year: faker.helpers.arrayElement(["1A", "2A", "3A"]),
      })
      .returning({ id: internshipsTable.internship_id });

    lastInternshipId = newInternship[0].id;

    // Chaque étudiant n'a qu'un seul stage (relation 1-1)
    completes.push({
      student_id: studentIds[i], // Utilise l'index pour garantir l'unicité
      internship_id: newInternship[0].id,
    });
  }

  await db.insert(completeTable).values(completes);
  return lastInternshipId;
}

async function displayInternshipDetails(internshipId: number) {
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

async function main() {
  try {
    console.log("🌱 Début du seeding...");

    await cleanDatabase(); // Ajout du nettoyage de la base de données

    const orgIds = await seedOrganizations();
    const studentIds = await seedStudents(orgIds);
    // Suppression de seedInternships() - stages créés uniquement dans seedComplete
    const lastInternshipId = await seedComplete(studentIds);

    console.log("✅ Seeding terminé avec succès !");

    // Affiche les détails du dernier stage créé (devrait avoir 1 seul étudiant)
    await displayInternshipDetails(lastInternshipId);

    // Ferme la connexion
    await client.end();
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    process.exit(1);
  }
}

main();
