"use client";
import { Loader2Icon, Search } from "lucide-react";
import { notFound } from "next/navigation";
import { useQueryState } from "nuqs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InternshipCard } from "@/features/internship/internship-card";
import { InternshipHeader } from "@/features/internship/internship-header";
import { InternshipCardSkeleton } from "@/features/internship/internship-skeleton";
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

  if (error) {
    notFound();
  }

  const showNoResults = !loading && totalCount === 0;

  if (showNoResults) {
    return (
      <div className="flex flex-1 justify-center items-center w-full">
        <div className="flex flex-col gap-4 mx-auto w-full max-w-2xl">
          <InternshipHeader
            totalCount={totalCount}
            sort={sort}
            setSort={setSort}
            loading={loading}
          />
          <div className="flex justify-center items-center py-12">
            <Alert className="w-full max-w-md">
              <Search className="w-4 h-4" />
              <AlertTitle>Aucun stage trouvé</AlertTitle>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-2xl">
      <InternshipHeader totalCount={totalCount} sort={sort} setSort={setSort} loading={loading} />

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(10)].map((_, i) => (
            <InternshipCardSkeleton key={`skeleton-${i + 1}`} />
          ))}
        </div>
      ) : (
        internships.map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))
      )}

      {hasMore ? (
        <div
          ref={loadingRef}
          className="flex justify-center items-center gap-2 py-8"
          style={{ minHeight: 60 }}
        >
          {loadingMore && (
            <>
              <Loader2Icon className="animate-spin" />
              <span className="text-muted-foreground text-sm">
                Chargement de plus de stages en cours...
              </span>
            </>
          )}
        </div>
      ) : (
        !loading && (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground text-sm">Tous les stages ont été chargés !</p>
          </div>
        )
      )}
    </div>
  );
}
