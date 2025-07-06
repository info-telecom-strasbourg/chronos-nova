"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { InternshipFilter } from "@/features/internship/internship-filter";
import { InternshipSearch } from "@/features/internship/internship-search";
import { SortInternshipButton } from "@/features/internship/internship-sort";

type InternshipHeaderProps = {
  sort: string;
  setSort: (v: string) => void;
  totalCount: number;
  loading?: boolean;
  search: string;
  setSearch: (v: string) => void;
};

export function InternshipHeader({
  totalCount,
  sort,
  setSort,
  loading,
  search,
  setSearch,
}: InternshipHeaderProps) {
  const isLoading = loading && totalCount === 0;
  return (
    <div className="space-y-4">
      <InternshipSearch value={search} onChange={setSearch} />

      <InternshipFilter />

      <div className="flex w-full items-center justify-between">
        {isLoading ? (
          <Skeleton className="h-5 w-40" />
        ) : (
          <p className="text-muted-foreground">
            {totalCount} stage{totalCount > 1 ? "s" : ""} trouvé{totalCount > 1 ? "s" : ""}
          </p>
        )}
        <div className="flex items-center gap-2">
          <p className="hidden text-muted-foreground sm:block">Trier par :</p>
          <SortInternshipButton value={sort} onChange={setSort} />
        </div>
      </div>
    </div>
  );
}
