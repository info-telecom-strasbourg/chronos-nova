"use client";

import { Button } from "@chronos/ui/components/button";
import { RotateCcw } from "lucide-react";
import { useInternshipFilters } from "@/hooks/use-internship-filters";
import { FilterMultiSelect } from "./filter-multi-select";

export function InternshipFilter() {
  const { filterGroups, hasFilters, isPending, isFetching, handleReset } =
    useInternshipFilters();

  return (
    <div className="space-y-5">
      {filterGroups.map((group) => (
        <FilterMultiSelect
          key={group.param}
          param={group.param}
          label={group.label}
          options={group.options}
          disabled={isFetching}
          loading={isPending}
        />
      ))}
      {hasFilters && (
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={handleReset}
        >
          <RotateCcw className="mr-1 size-3" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
