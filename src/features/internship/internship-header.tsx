"use client";
import type { InternshipFD } from "@/data/fake-data";
import { InternshipFilter } from "@/features/internship/internship-filter";
import { SortInternshipButton } from "@/features/internship/internship-sort";

type InternshipHeaderProps = {
  sort: string;
  setSort: (v: string) => void;
  fakeInternships: InternshipFD[];
};

export function InternshipHeader({ fakeInternships, sort, setSort }: InternshipHeaderProps) {
  return (
    <div>
      <div>
        <InternshipFilter />
      </div>
      <div className="flex justify-between items-center w-full">
        <p className="text-gray-600">
          {fakeInternships.length} stage{fakeInternships.length > 1 ? "s" : ""} trouvé
          {fakeInternships.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-gray-600 invisible sm:visible">Trier par :</p>
          <SortInternshipButton value={sort} onChange={setSort} />
        </div>
      </div>
    </div>
  );
}
