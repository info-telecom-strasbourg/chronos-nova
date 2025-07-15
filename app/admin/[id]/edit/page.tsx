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

  const defaultValues = {
    organizationName: internship.organization?.name || "",
    organizationType: internship.organization?.type || undefined,
    organizationCountry: internship.organization?.country || "",
    organizationCity: internship.organization?.city || "",
    subject: internship.subject || "",
    academicYear: internship.academicYear || undefined,
    beginDate: internship.beginDate || "",
    weeksCount: internship.weeksCount || undefined,
    studentFirstName: internship.student?.firstName || "",
    studentLastName: internship.student?.lastName || "",
    studentMajor: internship.student?.major?.alias || "",
    studentOption: internship.student?.option?.alias || "",
  };

  return <InternshipForm mode="edit" defaultValues={defaultValues} internshipId={id} />;
}
