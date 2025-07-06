"use client";
import { InternshipFilter } from "@/features/search/internship-filter";
import { InternshipSearch } from "@/features/search/internship-search";
import { SortInternshipButton } from "@/features/search/internship-sort";

export function InternshipHeader() {
  return (
    <div className="w-full bg-card px-4 py-6 shadow-md">
      <div className="mx-auto w-full max-w-screen-md space-y-4">
        <h1 className="scroll-m-20 font-bold text-2xl tracking-tight first:mt-0 md:text-3xl">
          Recherche un stage
        </h1>
        <InternshipSearch />
        <InternshipFilter />
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="hidden text-muted-foreground sm:block">Trier par :</p>
            <SortInternshipButton />
          </div>
        </div>
      </div>
    </div>
  );
}
