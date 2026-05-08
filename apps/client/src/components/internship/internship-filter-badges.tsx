"use client";

import { Badge } from "@chronos/ui/components/badge";
import { Button } from "@chronos/ui/components/button";
import { X } from "lucide-react";
import { useInternshipFilters } from "@/hooks/use-internship-filters";

export function InternshipFilterBadges() {
  const { activeFilters, removeFilter, handleReset } = useInternshipFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {activeFilters.map(({ param, value, label }) => (
        <Badge
          key={`${param}-${value}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {label}
          <button
            type="button"
            onClick={() => removeFilter(param, value)}
            aria-label={`Retirer le filtre ${label}`}
            className="ml-0.5 rounded-full opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="destructive"
          size="xs"
          onClick={handleReset}
          className="h-5 px-1.5 text-xs"
        >
          Tout effacer
        </Button>
      )}
    </div>
  );
}
