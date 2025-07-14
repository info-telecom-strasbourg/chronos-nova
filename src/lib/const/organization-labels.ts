// Mapping utilitaire pour afficher le label humain d'un type d'organisation

export const organizationTypeLabels: Record<string, string> = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

export function getOrganizationTypeLabel(type: string): string {
  return organizationTypeLabels[type] || type || "";
}
