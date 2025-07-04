import type { InternshipFD, OrganizationFD } from "@/data/fake-data";

export function getSortedInternships(
  sort: string,
  fakeInternships: InternshipFD[],
  fakeOrganizations: OrganizationFD[],
) {
  const internshipsSorted = [...fakeInternships];
  const organizationsSorted = [...fakeOrganizations];
  switch (sort) {
    case "name":
      organizationsSorted.sort((a, b) => a.orgName.localeCompare(b.orgName));
      return organizationsSorted;
    case "location":
      organizationsSorted.sort((a, b) => {
        const locA = `${fakeOrganizations[a.id - 1].country}, ${fakeOrganizations[a.id - 1].city}`;
        const locB = `${fakeOrganizations[b.id - 1].country}, ${fakeOrganizations[b.id - 1].city}`;
        return locA.localeCompare(locB);
      });
      return organizationsSorted;
    case "duration":
      internshipsSorted.sort((a, b) => Number(a.weeksCount) - Number(b.weeksCount));
      return internshipsSorted;
    default:
      internshipsSorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return internshipsSorted;
  }
}
