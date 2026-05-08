"use client";

import { Button } from "@chronos/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@chronos/ui/components/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useInternshipFilters } from "@/hooks/use-internship-filters";
import { InternshipFilter } from "./internship-filter";

export function InternshipFilterSheet() {
  const { hasFilters } = useInternshipFilters();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" size="sm" className="relative gap-2" />
          }
        >
          <SlidersHorizontal className="size-4" />
          Filtres
          {hasFilters && (
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
          )}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[85dvh] overflow-y-auto rounded-t-xl px-5 pt-2 pb-8"
        >
          <SheetHeader className="px-0 pb-4">
            <SheetTitle>Filtres</SheetTitle>
          </SheetHeader>
          <InternshipFilter />
        </SheetContent>
      </Sheet>
    </div>
  );
}
