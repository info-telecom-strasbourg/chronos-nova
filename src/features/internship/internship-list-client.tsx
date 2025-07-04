"use client";
import { Loader2Icon, Search } from "lucide-react";
import { notFound } from "next/navigation";
import { useQueryState } from "nuqs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InternshipCard } from "@/features/internship/internship-card";
import { InternshipCardSkeleton } from "@/features/internship/internship-skeleton";
import { useInternships } from "@/features/internship/use-internships";
import { InternshipHeader } from "@/features/search/internship-header";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

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
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <InternshipHeader
            totalCount={totalCount}
            sort={sort}
            setSort={setSort}
            loading={loading}
          />
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
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
          className="flex items-center justify-center gap-2 py-8"
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
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">Tous les stages ont été chargés !</p>
          </div>
        )
      )}
    </div>
  );
}
