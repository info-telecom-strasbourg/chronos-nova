"use client";
import { InternshipFilter } from "@/features/internship/internship-filter";
import { SortInternshipButton } from "@/features/internship/internship-sort";

type InternshipHeaderProps = {
  sort: string;
  setSort: (v: string) => void;
  totalCount: number;
};

export function InternshipHeader({ totalCount, sort, setSort }: InternshipHeaderProps) {
  return (
    <div>
      <div>
        <InternshipFilter />
      </div>
      <div className="flex w-full items-center justify-between">
        <p className="text-gray-600">
          {totalCount} stage{totalCount > 1 ? "s" : ""} trouvé
          {totalCount > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <p className="hidden text-gray-600 sm:block">Trier par :</p>
          <SortInternshipButton value={sort} onChange={setSort} />
        </div>
      </div>
    </div>
  );
}
