import type { PageParams } from "@/types/next";
import { notFound } from "next/navigation";
import { InternshipForm } from "@/features/form/internship-form";
import { getInternshipById } from "@/features/internship/internship.action";

export default async function EditInternshipPage({ params }: PageParams<{ id: string }>) {
  const { id } = await params;

  const internship = await getInternshipById(id);

  if (!internship) {
    notFound();
  }

  // Transformer les données de l'internship en defaultValues pour le formulaire
  const defaultValues = {
    organizationName: internship.organization?.name || "",
    organizationType: internship.organization?.type || undefined,
    organizationCountry: internship.organization?.country || undefined,
    organizationCity: internship.organization?.city || "",
    subject: internship.subject || "",
    academicYear: internship.academicYear || undefined,
    beginDate: internship.beginDate || "",
    weeksCount: internship.weeksCount || undefined,
    studentFirstName: internship.student?.firstName || "",
    studentLastName: internship.student?.lastName || "",
    studentMajor: internship.student?.major?.name || undefined,
    studentOption: internship.student?.option?.name || undefined,
  };

  return <InternshipForm mode="edit" defaultValues={defaultValues} internshipId={id} />;
}
