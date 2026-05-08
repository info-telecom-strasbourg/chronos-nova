"use client";

import { DeleteAllButton } from "@/features/admin/delete-all-button";
import { InternshipFilter } from "@/features/search/internship-filter";
import { InternshipSearch } from "@/features/search/internship-search";
import { SortInternshipButton } from "@/features/search/internship-sort";

interface AdminInternshipHeaderProps {
  /** L'état des stages affichés */
  state?: "draft" | "deleted";
}

export function AdminInternshipHeader({ state }: AdminInternshipHeaderProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <InternshipSearch />
        </div>
        {state && (
          <div className="flex justify-center sm:justify-end">
            <DeleteAllButton state={state} />
          </div>
        )}
      </div>

      <InternshipFilter />

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="hidden text-muted-foreground text-sm sm:block">Trier par :</p>
          <SortInternshipButton />
        </div>
      </div>
    </div>
  );
}
