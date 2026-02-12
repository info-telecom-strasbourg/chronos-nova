import { InternshipFilter } from "./internship-filter";
import { InternshipSearch } from "./internship-search";
import { InternshipSort } from "./internship-sort";

export function InternshipHeader() {
  return (
    <div className="w-full space-y-4">
      <h1 className="font-semibold text-4xl">Rechercher un stage</h1>
      <InternshipSearch />
      <InternshipFilter />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="hidden text-muted-foreground text-sm sm:block">
            Trier par :
          </p>
          <InternshipSort />
        </div>
      </div>
    </div>
  );
}
