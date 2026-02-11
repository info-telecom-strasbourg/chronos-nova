"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chronos/ui/components/card";
import { cn } from "@chronos/ui/lib/utils";
import {
  Building,
  Calendar,
  Calendar1,
  ChevronDown,
  Clock,
  GraduationCap,
  Landmark,
  MapPin,
  School,
} from "lucide-react";
import { useState } from "react";
import {
  getCityLabel,
  getCountryLabel,
  getDateLabel,
  getMajorFullLabel,
  getMajorShortLabel,
  getOptionFullLabel,
  getOptionShortLabel,
  getOrganizationTypeLabel,
  getSubjectLabel,
  getTitleLabel,
  getWeeksLabel,
} from "@/lib/formatters";
import type { InternshipData } from "@/types/internship";

type InternshipCardProps = {
  internship: InternshipData;
};

export function InternshipCard({ internship }: InternshipCardProps) {
  const [expanded, setExpanded] = useState(false);

  const majorAlias = internship.student?.major?.alias;
  const optionAlias = internship.student?.option?.alias;

  const majorLabel =
    !majorAlias || majorAlias === "__inconnu__"
      ? "??"
      : getMajorShortLabel(majorAlias);
  let optionLabel = "";
  if (optionAlias && optionAlias !== "aucune") {
    optionLabel =
      optionAlias === "__inconnu__" ? "??" : getOptionShortLabel(optionAlias);
  }

  return (
    <Card className="w-full">
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <CardHeader className="border-b-2 pb-4">
          <div className="flex w-full items-start justify-between">
            <CardTitle className="text-2xl">
              {getTitleLabel(internship.organization.name)}
            </CardTitle>
            <ChevronDown
              className={cn(
                "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          </div>
          <CardDescription>
            <span className="inline-flex items-center gap-1">
              <Building className="inline h-4 w-4 align-text-bottom" />
              {getOrganizationTypeLabel(internship.organization.type)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-4 px-6 text-justify font-thin">
          <p className={cn("mb-7", !expanded && "line-clamp-2")}>
            {getSubjectLabel(internship.subject)}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {getCountryLabel(internship.organization.country)},{" "}
                {getCityLabel(internship.organization.city)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>
                {internship.academicYear} - {majorLabel}
                {optionLabel ? ` - ${optionLabel}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getWeeksLabel(internship.weeksCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar1 className="h-4 w-4" />
              <span>{getDateLabel(internship.beginDate)}</span>
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && (
        <CardContent className="border-t pt-4">
          <div className="flex flex-col gap-3 text-sm">
            <span className="flex items-start gap-2">
              <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                <b>Pays :</b> {getCountryLabel(internship.organization.country)}
              </span>
            </span>
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                <b>Ville :</b> {getCityLabel(internship.organization.city)}
              </span>
            </span>
            <span className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                <b>Année :</b> {internship.academicYear}
              </span>
            </span>
            <span className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                <b>Diplôme :</b>{" "}
                {!majorAlias || majorAlias === "__inconnu__"
                  ? "??"
                  : getMajorFullLabel(majorAlias)}
              </span>
            </span>
            {optionAlias && optionAlias !== "aucune" && (
              <span className="flex items-start gap-2">
                <School className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  <b>Filière :</b>{" "}
                  {optionAlias === "__inconnu__"
                    ? "??"
                    : getOptionFullLabel(optionAlias)}
                </span>
              </span>
            )}
            <span className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                <b>Durée :</b> {getWeeksLabel(internship.weeksCount)}
              </span>
            </span>
            <span className="flex items-start gap-2">
              <Calendar1 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                <b>Date de début :</b> {getDateLabel(internship.beginDate)}
              </span>
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
