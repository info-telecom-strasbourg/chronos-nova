import type { InternshipData } from "@/types/drizzle";
import {
  Building,
  Calendar1,
  Clock,
  Edit,
  GraduationCap,
  Hash,
  MapPin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { InternshipDetailsDialog } from "./internship-details-dialog";

type InternshipCardProps = {
  internship: InternshipData;
  admin?: boolean;
};

export function InternshipCard({ internship, admin }: InternshipCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b-2 pb-4">
        <div className="flex w-full items-start justify-between">
          <CardTitle className="text-2xl">{internship.organization.name}</CardTitle>
          <span className="flex select-all items-center gap-1 text-muted-foreground text-xs">
            <Hash className="h-3 w-3" />
            {internship.id}
          </span>
        </div>
        <CardDescription>
          <span className="inline-flex items-center gap-1">
            <Building className="inline h-4 w-4 align-text-bottom" />
            {internship.organization.type}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-4 px-6 text-justify font-thin">
        <p className="mb-7">{internship.subject}</p>
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
              {internship.academicYear} - {internship.student.major.alias || "??"}
              {` - ${internship.student.option.alias}` || ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {internship.weeksCount && internship.weeksCount > 0 ? internship.weeksCount : "??"}{" "}
              semaines
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar1 className="h-4 w-4" />
            <span>{internship.beginDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 sm:justify-between">
        {admin && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/${internship.id}/edit`}>
                <Edit className="size-4" />
                Modifier
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </div>
        )}
        <div className="sm:ml-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Voir plus</Button>
            </DialogTrigger>
            <InternshipDetailsDialog internship={internship} />
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
