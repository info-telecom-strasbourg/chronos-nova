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

      <div className="flex justify-between items-center w-full">
        {isLoading ? (
          <Skeleton className="w-40 h-5" />
        ) : (
          <p className="text-muted-foreground">
            {totalCount} stage{totalCount > 1 ? "s" : ""} trouvé{totalCount > 1 ? "s" : ""}
          </p>
        )}
        <div className="flex items-center gap-2">
          <p className="hidden sm:block text-muted-foreground">Trier par :</p>
          <SortInternshipButton value={sort} onChange={setSort} />
        </div>
      </div>
    </div>
  );
}
