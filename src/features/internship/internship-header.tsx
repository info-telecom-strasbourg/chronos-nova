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
      <div className="flex justify-between items-center w-full">
        <p className="text-gray-600">
          {fakeInternships.length} stage{fakeInternships.length > 1 ? "s" : ""} trouvé
          {fakeInternships.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center">
          <p className="text-gray-600 hidden sm:inline mr-2">Trier par :</p>
          <SortInternshipButton value={sort} onChange={setSort} />
        </div>
      </div>
    </div>
  );
}
