"use client";
import { useQueryState } from "nuqs";
import { fakeInternships, fakeOrganizations, fakeStudents } from "@/data/fake-data";
import { InternshipCard } from "@/features/internship/internship-card";
import { InternshipHeader } from "@/features/internship/internship-header";
import { getSortedInternships } from "@/features/internship/sort-internship";

export function InternshipListClient() {
  const [sort, setSort] = useQueryState("sort", { defaultValue: "most-recent" });
  const sortedData = getSortedInternships(sort, fakeInternships, fakeOrganizations);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <InternshipHeader fakeInternships={fakeInternships} sort={sort} setSort={setSort} />
      {sortedData.map((elem) => {
        const internship = fakeInternships[elem.id - 1];
        const org = fakeOrganizations[elem.id - 1];
        const student = fakeStudents[elem.id - 1];
        return (
          <InternshipCard
            key={internship.id}
            student={student}
            organization={org}
            internship={internship}
          />
        );
      })}
    </div>
  );
}
