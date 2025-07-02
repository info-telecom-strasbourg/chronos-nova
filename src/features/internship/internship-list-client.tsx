"use client";
import { Search } from "lucide-react";
import { notFound } from "next/navigation";
import { useQueryState } from "nuqs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InternshipCard } from "@/features/internship/internship-card";
import { InternshipHeader } from "@/features/internship/internship-header";
import { InternshipListSkeleton } from "@/features/internship/internship-skeleton";
import { useInternships } from "@/hooks/use-internships";

export function InternshipListClient() {
  const [sort, setSort] = useQueryState("sort", { defaultValue: "most-recent" });
  const { internships, loading, error } = useInternships(sort);

  if (loading) {
    return <InternshipListSkeleton />;
  }

  if (error) {
    notFound();
  }

  if (internships.length === 0) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <InternshipHeader fakeInternships={internships} sort={sort} setSort={setSort} />
          <div className="flex items-center justify-center py-12">
            <Alert className="w-full max-w-md">
              <Search className="h-4 w-4" />
              <AlertTitle>Aucun stage trouvé</AlertTitle>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <InternshipHeader fakeInternships={internships} sort={sort} setSort={setSort} />
      {internships.map((internship) => (
        <InternshipCard key={internship.id} internship={internship} />
      ))}
    </div>
  );
}
