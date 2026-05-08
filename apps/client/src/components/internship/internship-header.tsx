import { InternshipFilterSheet } from "./internship-filter-sheet";
import { InternshipSearch } from "./internship-search";
import { InternshipSort } from "./internship-sort";

export function InternshipHeader() {
  return (
    <div className="w-full space-y-3">
      <h1 className="font-semibold text-4xl">Rechercher un stage</h1>
      <div className="flex gap-2 max-md:flex-col md:items-center">
        <InternshipSearch />
        <div className="flex gap-2">
          <InternshipSort />
          <InternshipFilterSheet />
        </div>
      </div>
    </div>
  );
}
