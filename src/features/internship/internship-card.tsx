import { Building, Calendar, Clock, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { InternshipFD, OrganizationFD, StudentFD } from "@/data/fake-data";
import { formatDate } from "@/lib/format-date";

type InternshipCardProps = {
  internship: InternshipFD;
  organization: OrganizationFD;
  student: StudentFD;
};

export function InternshipCard({ internship, organization, student }: InternshipCardProps) {
  return (
    <div>
      <Card>
        <CardHeader className="border-b-2 pb-4">
          <CardTitle className="text-2xl">{organization.orgName}</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center gap-1">
              <Building className="w-4 h-4 inline align-text-bottom" />
              {organization.orgType}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="font-thin mb-4 px-6 text-justify">
          <p className="mb-7">{internship.subject}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {organization.country}, {organization.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>
                {internship.year} - {student.major}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{internship.weeksCount} semaines</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(internship.date)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center sm:justify-end">
          <Button variant="outline">Voir les détails</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
