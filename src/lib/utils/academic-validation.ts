import { academicStructure, getOptionsForMajor } from "@/features/form/options";

/**
 * Valide et corrige la cohérence année/major/option selon le schéma academicStructure
 */
export function validateAndFixAcademicData(
  academicYear: string | null,
  major: string | null,
  option: string | null,
): {
  major: string | null;
  option: string | null;
} {
  // Si pas d'année académique, on ne peut pas valider
  if (!academicYear || !["1A", "2A", "3A"].includes(academicYear)) {
    return {
      major: major || "__inconnu__",
      option: option || "__inconnu__",
    };
  }

  // Vérifier si le major existe dans l'année donnée
  const yearData = academicStructure[academicYear as keyof typeof academicStructure];
  if (!yearData || !major || !(major in yearData)) {
    // Le diplôme n'existe pas dans cette année
    return {
      major: "__inconnu__",
      option: "__inconnu__",
    };
  }

  // Le major existe, vérifier l'option
  const validOptions = getOptionsForMajor(academicYear, major);
  const isValidOption = validOptions.some((opt) => opt.value === option);

  if (!isValidOption) {
    // L'option n'est pas valide pour ce couple année/major
    return {
      major,
      option: "__inconnu__",
    };
  }

  // Tout est cohérent
  return {
    major,
    option,
  };
}
