"use client";

import { InternshipFilter } from "@/features/search/internship-filter";
import { InternshipSearch } from "@/features/search/internship-search";
import { SortInternshipButton } from "@/features/search/internship-sort";
import { DeleteAllButton } from "@/features/admin/delete-all-button";

interface AdminInternshipHeaderProps {
  /** L'état des stages affichés */
  state?: "draft" | "deleted";
}

export function AdminInternshipHeader({ state }: AdminInternshipHeaderProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
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

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <p className="hidden sm:block text-muted-foreground text-sm">Trier par :</p>
          <SortInternshipButton />
        </div>
      </div>
    </div>
  );
}
