import type { PageParams } from "@/types/next";
import { notFound } from "next/navigation";
import { EditInternshipForm } from "@/features/form/edit-form-client";
import { getInternshipById } from "@/lib/actions/internship";

export default async function EditInternshipPage({ params }: PageParams<{ id: string }>) {
  const { id } = await params;

  const internship = await getInternshipById(id);

  if (!internship) {
    notFound();
  }

  return <EditInternshipForm internship={internship} />;
}
