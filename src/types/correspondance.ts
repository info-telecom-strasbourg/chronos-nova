export const COURSE_MAPPING: Record<string, string> = {
  SDIA: "Science des données et intelligence artificielle",
  RIO: "Réseaux et internet des objets",
};

export const MAJOR_MAPPING: Record<string, string> = {
  "TI Santé": "Technologies de l'information pour la santé",
  IR: "Informatique et Réseaux",
};

export function getFullCourseName(acronym: string): string {
  return COURSE_MAPPING[acronym] || "";
}

export function getFullMajorName(acronym: string): string {
  return MAJOR_MAPPING[acronym] || "";
}
