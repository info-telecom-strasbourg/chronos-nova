import type { InternshipCardData } from "@/types/drizzle";
import { createClient } from "@supabase/supabase-js";

// Configuration Supabase pour les requêtes frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Les variables d'environnement Supabase sont manquantes");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Récupère tous les stages avec leurs étudiants et organisations associés
 * @param sort - Type de tri à appliquer ('most-recent', 'organization', 'duration', 'location')
 * @param page - Numéro de la page (commence à 1)
 * @param limit - Nombre d'éléments par page
 */
export async function getAllInternshipsData(
  sort: string = "most-recent",
  page: number = 1,
  limit: number = 10,
) {
  try {
    const offset = (page - 1) * limit;

    // Requête avec jointures pour récupérer toutes les données nécessaires
    let query = supabase
      .from("Complete")
      .select(`
        internship_id,
        student_id,
        Internship!inner (
          internship_id,
          internship_subject,
          internship_confidential,
          internship_dates,
          internship_period,
          internship_year
        ),
        Student!inner (
          student_id,
          student_firstname,
          student_lastname,
          student_degree,
          student_course,
          organization_id,
          Organization!inner (
            organization_id,
            organization_name,
            organization_type,
            organization_country,
            organization_city,
            organization_postal_code,
            tutor_firstname,
            tutor_lastname
          )
        )
      `)
      .range(offset, offset + limit - 1);

    // Application du tri selon le paramètre
    switch (sort) {
      case "most-recent":
        // Tri par date décroissante
        query = query.order("internship_dates", {
          foreignTable: "Internship",
          ascending: false,
        });
        break;
      case "organization":
        query = query.order("organization_name", {
          foreignTable: "Student.Organization",
          ascending: true,
        });
        break;
      case "duration":
        // Tri par durée de stage (période en semaines) - ordre décroissant
        query = query.order("internship_period", {
          foreignTable: "Internship",
          ascending: false,
        });
        break;
      case "location":
        // Tri par localisation : pays puis ville
        query = query.order("organization_country", {
          foreignTable: "Student.Organization",
          ascending: true,
        });
        break;
      default:
        // Tri par défaut : plus récent
        query = query.order("internship_dates", {
          foreignTable: "Internship",
          ascending: false,
        });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed query: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transformer les données pour correspondre au format attendu
    return data.map((row: Record<string, unknown>) => ({
      internship: {
        internship_id: (row.Internship as Record<string, unknown>)?.internship_id as number,
        internship_subject: (row.Internship as Record<string, unknown>)
          ?.internship_subject as string,
        internship_confidential: (row.Internship as Record<string, unknown>)
          ?.internship_confidential as boolean,
        internship_dates: (row.Internship as Record<string, unknown>)?.internship_dates as string,
        internship_period: (row.Internship as Record<string, unknown>)?.internship_period as number,
        internship_year: (row.Internship as Record<string, unknown>)?.internship_year as string,
      },
      student: {
        student_id: (row.Student as Record<string, unknown>)?.student_id as number,
        student_firstname: (row.Student as Record<string, unknown>)?.student_firstname as string,
        student_lastname: (row.Student as Record<string, unknown>)?.student_lastname as string,
        student_degree: (row.Student as Record<string, unknown>)?.student_degree as string,
        student_course: (row.Student as Record<string, unknown>)?.student_course as string,
        organization_id: (row.Student as Record<string, unknown>)?.organization_id as number,
      },
      organization: {
        organization_id: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.organization_id as number,
        organization_name: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.organization_name as string,
        organization_type: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.organization_type as string,
        organization_country: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.organization_country as string,
        organization_city: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.organization_city as string,
        organization_postal_code: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.organization_postal_code as number,
        tutor_firstname: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.tutor_firstname as string,
        tutor_lastname: (
          (row.Student as Record<string, unknown>)?.Organization as Record<string, unknown>
        )?.tutor_lastname as string,
      },
    }));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données de stages:", error);
    throw error;
  }
}

/**
 * Récupère un stage spécifique avec tous ses étudiants et organisation
 * @param internshipId - ID du stage à récupérer
 */
export async function getInternshipData(internshipId: number) {
  try {
    const { data, error } = await supabase
      .from("Complete")
      .select(`
        internship_id,
        student_id,
        Internship!inner (
          internship_id,
          internship_subject,
          internship_confidential,
          internship_dates,
          internship_period,
          internship_year
        ),
        Student!inner (
          student_id,
          student_firstname,
          student_lastname,
          student_degree,
          student_course,
          organization_id,
          Organization!inner (
            organization_id,
            organization_name,
            organization_type,
            organization_country,
            organization_city,
            organization_postal_code,
            tutor_firstname,
            tutor_lastname
          )
        )
      `)
      .eq("internship_id", internshipId);

    if (error) {
      throw new Error(`Failed to get internship: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du stage ${internshipId}:`, error);
    throw error;
  }
}

/**
 * Transforme les données de la base en format compatible avec les composants frontend
 */
export function transformToCardData(
  data: Array<{
    internship: {
      internship_id: number;
      internship_subject: string;
      internship_confidential: boolean;
      internship_dates: string;
      internship_period: number;
      internship_year: string;
    };
    student: {
      student_id: number;
      student_firstname: string;
      student_lastname: string;
      student_degree: string;
      student_course: string;
      organization_id: number;
    };
    organization: {
      organization_id: number;
      organization_name: string;
      organization_type: string;
      organization_country: string;
      organization_city: string;
      organization_postal_code: number;
      tutor_firstname: string;
      tutor_lastname: string;
    };
  }>,
): InternshipCardData[] {
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
      course:
        item.student.student_course && item.student.student_course !== "??"
          ? item.student.student_course
          : undefined,
    },
    organization: {
      orgName: item.organization.organization_name,
      tutorFirstName: item.organization.tutor_firstname,
      tutorLastName: item.organization.tutor_lastname,
      orgType: item.organization.organization_type,
      country: item.organization.organization_country || undefined,
      city: item.organization.organization_city || undefined,
      postalCode: item.organization.organization_postal_code || undefined,
    },
  }));
}

/**
 * Récupère le nombre total de stages
 */
export async function getTotalInternshipsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("Complete")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Failed to get total count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error("❌ Erreur lors du comptage des stages:", error);
    throw error;
  }
}
