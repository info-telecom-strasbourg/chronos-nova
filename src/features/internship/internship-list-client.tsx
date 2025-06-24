"use client";
import { useState } from "react";
import { InternshipHeader } from "@/features/internship/internship-header";
import { InternshipCard } from "@/features/internship/internship-card";
import { getSortedInternships } from "@/lib/sort-internship";
import { fakeInternships, fakeOrganizations, fakeStudents } from "@/data/fake-data";

type InternshipListClientProps = {
  key: string;
};

export function InternshipListClient({ key }: InternshipListClientProps) {
  const [sort, setSort] = useState("most-recent");
  const sortedData = getSortedInternships(sort, fakeInternships, fakeOrganizations);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <InternshipHeader
        fakeInternships={fakeInternships}
        sort={sort}
        setSort={setSort}
      />
      {sortedData.map((elem) => {
        const internship = fakeInternships[elem.key - 1];
        const org = fakeOrganizations[elem.key - 1];
        const student = fakeStudents[elem.key - 1];
        return (
          <InternshipCard
            key={internship.key}
            student={student}
            organization={org}
            internship={internship}
          />
        );
      })}
    </div>
  );
}