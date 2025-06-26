"use client";
import type { InternshipFD } from "@/data/fake-data";
import { SortInternshipButton } from "@/features/internship/internship-sort";

type InternshipHeaderProps = {
  sort: string;
  setSort: (v: string) => void;
  fakeInternships: InternshipFD[];
};

export function InternshipHeader({ fakeInternships, sort, setSort }: InternshipHeaderProps) {
  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <p className="text-gray-600">
          {fakeInternships.length} stage{fakeInternships.length > 1 ? "s" : ""} trouvé
          {fakeInternships.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center">
          <p className="mr-2 hidden text-gray-600 sm:inline">Trier par :</p>
          <SortInternshipButton value={sort} onChange={setSort} />
        </div>
      </div>
    </div>
  );
}
