import type { InternshipCardData } from "@/types/database";
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
import { formatDate } from "@/lib/format-date";

type InternshipCardProps = {
  internship: InternshipCardData;
};

export function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <div>
      <Card>
        <CardHeader className="border-b-2 pb-4">
          <CardTitle className="text-2xl">{internship.organization.orgName}</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center gap-1">
              <Building className="inline h-4 w-4 align-text-bottom" />
              {internship.organization.orgType}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-4 px-6 text-justify font-thin">
          <p className="mb-7">{internship.internship.subject}</p>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {internship.organization.country}, {internship.organization.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>
                {internship.internship.year} - {internship.student.major}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{internship.internship.weeksCount} semaines</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(internship.internship.date)}</span>
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
