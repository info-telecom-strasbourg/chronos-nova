import type { Internship, Organization, Student } from "./type-definition.js";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import {
  formatInternshipForDatabase,
  formatOrganizationForDatabase,
  formatStudentForDatabase,
} from "./data-normalizer.js";

// Charger les variables d'environnement
config();

// Configuration Supabase sécurisée
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Les variables d'environnement Supabase sont manquantes (NEXT_PUBLIC_SUPABASE_URL et/ou SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY)",
  );
}
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Insère les données parsées dans Supabase
 */
export async function insertDataToSupabase(
  internships: Internship[],
  students: Student[],
  organizations: Organization[],
) {
  try {
    console.log("📥 Début de l'insertion dans Supabase...");

    // Nettoyage des tables (dans cet ordre pour respecter les contraintes de clé étrangère)
    await supabase.from("Complete").delete().neq("internship_id", 0);
    await supabase.from("Student").delete().neq("student_id", 0);
    await supabase.from("Internship").delete().neq("internship_id", 0);
    await supabase.from("Organization").delete().neq("organization_id", 0);

    console.log("Tables vidées !");
    console.log(`${organizations.length} organisations à insérer...`);
    console.log(`${students.length} étudiants à insérer...`);
    console.log(`${internships.length} stages à insérer...`);

    // Insertion des organisations
    const orgData = organizations.map(formatOrganizationForDatabase);
    const { data: orgs, error: orgError } = await supabase
      .from("Organization")
      .insert(orgData)
      .select("organization_id");
    if (orgError) throw orgError;

    // Insertion des étudiants (en liant à la bonne org si besoin)
    const studentsWithOrg = students.map((student, i) =>
      formatStudentForDatabase(student, orgs?.[i]?.organization_id ?? orgs?.[0]?.organization_id),
    );
    const { data: studs, error: studError } = await supabase
      .from("Student")
      .insert(studentsWithOrg)
      .select("student_id");
    if (studError) throw studError;

    // Insertion des stages
    const internshipData = internships.map(formatInternshipForDatabase);
    const { data: stages, error: stageError } = await supabase
      .from("Internship")
      .insert(internshipData)
      .select("internship_id");
    if (stageError) throw stageError;

    // Création des relations dans Complete
    const completeData = internships
      .map((_, i) => ({
        student_id: studs?.[i]?.student_id,
        internship_id: stages?.[i]?.internship_id,
      }))
      .filter((item) => item.student_id && item.internship_id);

    const { error: completeError } = await supabase.from("Complete").insert(completeData);
    if (completeError) throw completeError;

    console.log("✅ Données insérées dans Supabase !");
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
    throw error;
  }
}
