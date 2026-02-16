import { Badge } from "@chronos/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chronos/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@chronos/ui/components/empty";
import {
  Building2,
  Calendar,
  Check,
  CircleAlert,
  Clock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import type { getInternshipsAction } from "@/actions/internship.action";

const ORGANIZATION_TYPE_LABELS = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

type InternshipCardProps = {
  internship: Awaited<ReturnType<typeof getInternshipsAction>>["data"][number];
};

export function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg leading-snug">
          {internship.subject}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Building2 className="size-3.5 shrink-0" />
          <span>{internship.organizationName}</span>
          {internship.organizationType && (
            <Badge variant="outline">
              {ORGANIZATION_TYPE_LABELS[internship.organizationType]}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
        {(internship.major || internship.option || internship.academicYear) && (
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="size-3.5 shrink-0" />
            {[internship.major, internship.option, internship.academicYear]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
        {(internship.country || internship.city) && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            {[internship.city, internship.country].filter(Boolean).join(", ")}
          </span>
        )}
        {internship.beginDate && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            {new Date(internship.beginDate).toLocaleDateString("fr")}
          </span>
        )}
        {internship.weeksCount && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" />
            {internship.weeksCount} semaines
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export function NoInternshipCard() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>Aucun stage trouvé</EmptyTitle>
        <EmptyDescription>Essayer avec d'autres filtres</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function DoneInternshipCard() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Check />
        </EmptyMedia>
        <EmptyTitle>Tous les stages ont été chargés</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
