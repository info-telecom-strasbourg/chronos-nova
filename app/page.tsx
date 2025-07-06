import type { PageParams } from "@/types/next";
import { getInternshipsQuery } from "@/features/internship/internship.query";
import { InternshipCard } from "@/features/internship/internship-card";

export default async function RoutePage({ searchParams }: PageParams) {
  const { data: internships } = await getInternshipsQuery(await searchParams);
  return (
    <div className="flex h-full flex-col items-center justify-start gap-4 pt-8">
      {internships?.map((internship) => (
        <InternshipCard internship={internship} key={internship.id} />
      ))}
    </div>
  );
}
