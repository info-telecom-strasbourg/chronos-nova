"use client";
import { Loader2Icon, Search } from "lucide-react";
import { notFound } from "next/navigation";
import { useQueryState } from "nuqs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InternshipCard } from "@/features/internship/internship-card";
import { InternshipHeader } from "@/features/internship/internship-header";
import { InternshipListSkeleton } from "@/features/internship/internship-skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInternships } from "@/hooks/use-internships";

export function InternshipListClient() {
  const [sort, setSort] = useQueryState("sort", { defaultValue: "most-recent" });
  const { internships, loading, loadingMore, error, hasMore, totalCount, loadMore } =
    useInternships(sort);

  const loadingRef = useInfiniteScroll({
    hasNextPage: hasMore,
    isLoading: loadingMore,
    loadMore: loadMore,
    threshold: 300,
  });

  if (loading) {
    return <InternshipListSkeleton />;
  }

  if (error) {
    notFound();
  }

  if (totalCount === 0) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <InternshipHeader totalCount={totalCount} sort={sort} setSort={setSort} />
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
      <InternshipHeader totalCount={totalCount} sort={sort} setSort={setSort} />
      {internships.map((internship) => (
        <InternshipCard key={internship.id} internship={internship} />
      ))}

      {hasMore ? (
        <div
          ref={loadingRef}
          className="flex items-center justify-center gap-2 py-8"
          style={{ minHeight: 60 }}
        >
          {loadingMore && (
            <>
              <Loader2Icon className="animate-spin" />
              <span className="text-gray-600 text-sm">
                Chargement de plus de stages en cours...
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-gray-600 text-sm">Tous les stages ont été chargés !</p>
          </div>
        </div>
      )}
    </div>
  );
}
