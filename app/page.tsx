import type { PageParams } from "@/types/next";
import { InternshipCard } from "@/components/internship/internshipCard";
import { fakeInternships, fakeOrganizations, fakeStudents} from "@/data/fake_data";


export default async function RoutePage(_: PageParams) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {fakeInternships.map((internship, idx) => {
          const org = fakeOrganizations[idx];
          const student = fakeStudents[idx];
          return (
            <InternshipCard
              key={idx}
              subject={internship.subject}
              year={internship.year}
              weeksCount={internship.weeksCount}
              date={internship.date}
              orgName={org.orgName}
              orgType={org.orgType}
              country={org.country}
              major={student.major}
            />
          );
        })}
      </div>
    </div>
  );
}
