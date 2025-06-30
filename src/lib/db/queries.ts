import { eq, asc, desc, sql } from "drizzle-orm";
import { db } from "./index";
import { completeTable, internshipsTable, organizationsTable, studentsTable } from "./schema";
import type { InternshipCardData } from "@/types/database";

/**
 * Fonction de base pour construire la requête avec jointures
 * Évite la duplication de code entre getAllInternshipsData et getInternshipData
 */
function createBaseInternshipQuery() {
  return db
    .select({
      internship: internshipsTable,
      student: studentsTable,
      organization: organizationsTable,
    })
    .from(completeTable)
    .innerJoin(internshipsTable, eq(completeTable.internship_id, internshipsTable.internship_id))
    .innerJoin(studentsTable, eq(completeTable.student_id, studentsTable.student_id))
    .innerJoin(
      organizationsTable,
      eq(studentsTable.organization_id, organizationsTable.organization_id),
    );
}

/**
 * Récupère tous les stages avec leurs étudiants et organisations associés
 * @param sort - Type de tri à appliquer ('most-recent', 'name', 'duration', 'location')
 */
export async function getAllInternshipsData(sort: string = 'most-recent') {
  try {
    const baseQuery = createBaseInternshipQuery();

    // Application du tri selon le paramètre
    switch (sort) {
      case 'most-recent':
        // Conversion des dates françaises DD/MM/YYYY en format PostgreSQL pour tri
        return await baseQuery.orderBy(
          desc(sql`TO_DATE(${internshipsTable.internship_dates}, 'DD/MM/YYYY')`)
        );
      case 'organization':
        return await baseQuery.orderBy(asc(organizationsTable.organization_name));
      case 'duration':
        // Tri par durée de stage (période en semaines) - ordre croissant (plus court d'abord)
        return await baseQuery.orderBy(asc(internshipsTable.internship_period));
      case 'location':
        // Tri par localisation : pays puis ville (ordre alphabétique)
        return await baseQuery.orderBy(
          asc(organizationsTable.organization_country),
          asc(organizationsTable.organization_city)
        );
      default:
        // Tri par défaut : plus récent
        return await baseQuery.orderBy(
          desc(sql`TO_DATE(${internshipsTable.internship_dates}, 'DD/MM/YYYY')`)
        );
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données de stages:", error);
    throw error; // Re-throw pour que l'API puisse gérer l'erreur
  }
}

/**
 * Récupère un stage spécifique avec tous ses étudiants et organisation
 * @param internshipId - ID du stage à récupérer
 */
export async function getInternshipData(internshipId: number) {
  try {
    const data = await createBaseInternshipQuery()
      .where(eq(completeTable.internship_id, internshipId));

    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du stage ${internshipId}:`, error);
    throw error;
  }
}

/**
 * Transforme les données de la base en format compatible avec les composants frontend
 */
export function transformToCardData(data: Array<{
  internship: typeof internshipsTable.$inferSelect;
  student: typeof studentsTable.$inferSelect;
  organization: typeof organizationsTable.$inferSelect;
}>): InternshipCardData[] {
  return data.map((item) => ({
    id: item.internship.internship_id,
    internship: {
      subject: item.internship.internship_subject,
      confidential: item.internship.internship_confidential,
      date: item.internship.internship_dates,
      weeksCount: item.internship.internship_period,
      year: item.internship.internship_year,
    },
    student: {
      firstName: item.student.student_firstname,
      lastName: item.student.student_lastname,
      major: item.student.student_degree || undefined,
    },
    organization: {
      orgName: item.organization.organization_name,
      tutorFirstName: item.organization.tutor_firstname,
      tutorLastName: item.organization.tutor_lastname,
      orgType: item.organization.organization_type === "E" ? "Entreprise" : "Laboratoire",
      country: item.organization.organization_country || undefined,
      city: item.organization.organization_city || undefined,
    },
  }));
}
