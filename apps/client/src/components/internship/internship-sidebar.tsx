import { InternshipFilter } from "./internship-filter";

export function InternshipSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-24 rounded-xl border bg-card p-4">
        <p className="mb-4 font-medium text-sm">Filtres</p>
        <InternshipFilter />
      </div>
    </aside>
  );
}
