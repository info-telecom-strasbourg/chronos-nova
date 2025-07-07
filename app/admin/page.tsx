import type { PageParams } from "@/types/next";
import { InternshipList } from "@/features/internship/internship-list";

// liste de stages avec référence et bouton edit / delete + un bouton en haut ajouter un stage
export default async function RoutePage(_: PageParams) {
  return <InternshipList />;
}
