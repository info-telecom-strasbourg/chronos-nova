import type { InternshipData } from "@/types/drizzle";
import { Calendar, Calendar1, Clock, GraduationCap, Landmark, MapPin, School } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCountryLabel, getMajorFullLabel, getOptionFullLabel } from "@/features/parser/mappings";
import { formatDate } from "@/lib/scripts/date";

type InternshipDetailsDialogProps = {
  internship: InternshipData;
};

export function InternshipDetailsDialog({ internship }: InternshipDetailsDialogProps) {
  return (
    <DialogContent>
      <DialogHeader className="border-b-2">
        <DialogTitle>
          <div className="mb-4 flex w-full flex-row items-center gap-4">
            <span>Détails du stage</span>
          </div>
        </DialogTitle>
      </DialogHeader>

      <DialogDescription asChild>
        <div className="flex flex-col gap-3">
          <span className="flex items-start gap-2">
            <span>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Pays :</b> {getCountryLabel(internship.organization.country)}
            </span>
          </span>
          <span className="flex items-start gap-2">
            <span>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Ville :</b> {internship.organization.city}
            </span>
          </span>
          <span className="flex items-start gap-2">
            <span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Année :</b> {internship.academicYear}
            </span>
          </span>
          <span className="flex items-start gap-2">
            <span>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Diplôme :</b> {getMajorFullLabel(internship.student.major.alias)}
            </span>
          </span>
          {internship.student.option && internship.student.option.alias !== "aucune" && (
            <span className="flex items-start gap-2">
              <span>
                <School className="h-4 w-4 text-muted-foreground" />
              </span>
              <span>
                <b>Filière :</b> {getOptionFullLabel(internship.student.option.alias)}
              </span>
            </span>
          )}
          <span className="flex items-start gap-2">
            <span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Durée :</b> {internship.weeksCount} semaines
            </span>
          </span>
          <span className="flex items-start gap-2">
            <span>
              <Calendar1 className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Date de début :</b> {formatDate(internship.beginDate || "")}
            </span>
          </span>
        </div>
      </DialogDescription>
    </DialogContent>
  );
}
