import { InternshipFilter } from "./internship-filter";
import { InternshipSearch } from "./internship-search";
import { InternshipSort } from "./internship-sort";

export function InternshipHeader() {
  return (
    <div className="w-full space-y-3">
      <h1 className="font-semibold text-4xl">Rechercher un stage</h1>
      <div className="flex gap-2 max-md:flex-col md:items-center">
        <InternshipSearch />
        <InternshipSort />
      </div>
      <div className="flex flex-wrap gap-2">
        <InternshipFilter />
      </div>
    </div>
  );
}
