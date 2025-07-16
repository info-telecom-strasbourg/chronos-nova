import type { InternshipData } from "@/types/drizzle";
import { Calendar, Calendar1, Clock, GraduationCap, Landmark, MapPin, School } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCityLabel,
  getCountryLabel,
  getDateLabel,
  getMajorFullLabel,
  getOptionFullLabel,
  getWeeksLabel,
} from "@/features/parser/mappings";

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
              <b>Ville :</b> {getCityLabel(internship.organization.city)}
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
          {/* Diplôme : toujours afficher, "??" si inconnu */}
          <span className="flex items-start gap-2">
            <span>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Diplôme :</b>{" "}
              {internship.student?.major?.alias === "__inconnu__" ||
              !internship.student?.major?.alias
                ? "??"
                : getMajorFullLabel(internship.student.major.alias)}
            </span>
          </span>
          {/* Filière : afficher si diplôme inconnu, sinon comme avant */}
          {internship.student?.option?.alias &&
            (internship.student?.major?.alias === "__inconnu__" ||
              (internship.student.option.alias !== "aucune" &&
                internship.student.option.alias !== "__inconnu__")) && (
              <span className="flex items-start gap-2">
                <span>
                  <School className="h-4 w-4 text-muted-foreground" />
                </span>
                <span>
                  <b>Filière :</b>{" "}
                  {internship.student.option.alias === "__inconnu__"
                    ? "??"
                    : getOptionFullLabel(internship.student.option.alias)}
                </span>
              </span>
            )}
          <span className="flex items-start gap-2">
            <span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Durée :</b> {getWeeksLabel(internship.weeksCount)}
            </span>
          </span>
          <span className="flex items-start gap-2">
            <span>
              <Calendar1 className="h-4 w-4 text-muted-foreground" />
            </span>
            <span>
              <b>Date de début :</b> {getDateLabel(internship.beginDate)}
            </span>
          </span>
        </div>
      </DialogDescription>
    </DialogContent>
  );
}
