import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Building,MapPin, Calendar, Clock, GraduationCap } from 'lucide-react';
import { InternshipYear, StudentMajor, OrgType } from "@/data/fake_data";
import { formatDate } from "@/lib/formatDate";

type InternshipCardProps = {
  subject: string;
  year: InternshipYear;
  weeksCount: number;
  date: string;
  orgName: string;
  orgType: OrgType;
  country: string;
  major: StudentMajor;
};

export function InternshipCard({
  subject,
  year,
  weeksCount,
  date,
  orgName,
  orgType,
  country,
  major,
}: InternshipCardProps) {
  return (
    <div>
      <Card className="border-gray-200 hover:border-gray-600 transition-colors shadow-md">
        <CardHeader className="border-b-2 pb-4">
          <CardTitle className="text-2xl">{orgName}</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center gap-1">
              <Building className="w-4 h-4 inline align-text-bottom" />
              {orgType}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="font-thin mb-4 px-6 text-justify">
          <p className="mb-7">
            {subject}
            </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{country}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>{year} - {major}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{weeksCount} semaines</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center sm:justify-end">
          <Button
            variant="outline"
            className="
              border-2 border-gray-300 rounded-lg
              text-gray-700 font-semibold
              transition
              hover:border-blue-600 hover:text-blue-600
              px-5 py-2
            "
          >
            Voir les détails
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}