"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InternshipFilter } from "@/features/search/internship-filter";
import { InternshipSearch } from "@/features/search/internship-search";
import { SortInternshipButton } from "@/features/search/internship-sort";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function InternshipHeader() {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { count, error } = await supabase
          .from("internship")
          .select("*", { count: "exact", head: true });

        if (error) {
          throw new Error(`Failed to get total count: ${error.message}`);
        }

        setTotalCount(count || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre total de stages:", error);
        setTotalCount(0);
      }
    };

    fetchTotalCount();
  }, []);

  return (
    <div className="w-full space-y-4">
      <InternshipSearch />
      <InternshipFilter />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {totalCount !== null ? (
            <p className="text-muted-foreground text-sm">
              {totalCount} stage{totalCount > 1 ? "s" : ""} trouvé{totalCount > 1 ? "s" : ""}
            </p>
          ) : (
            <Skeleton className="h-5 w-32" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-muted-foreground text-sm sm:block">Trier par :</p>
          <SortInternshipButton />
        </div>
      </div>
    </div>
  );
}
