import type { InternshipData } from "@/types/drizzle";
import {
  Building,
  Calendar1,
  Check,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  MapPin,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import { InternshipActions } from "@/features/admin/internship-actions";
import { InternshipDetailsDialog } from "./internship-details-dialog";

type InternshipCardProps = {
  internship: InternshipData;
  admin?: boolean;
};

export function InternshipCard({ internship, admin }: InternshipCardProps) {
  const actions = InternshipActions({
    internshipId: internship.id,
  });

  const getStateBadge = () => {
    const stateLabels = {
      visible: { label: "Actif", variant: "default" as "default" },
      draft: { label: "En attente", variant: "outline" as "outline" },
      deleted: { label: "Supprimé", variant: "destructive" as "destructive" },
    };

    const stateInfo = stateLabels[internship.state as keyof typeof stateLabels];
    return stateInfo ? <Badge variant={stateInfo.variant}>{stateInfo.label}</Badge> : null;
  };

  const getActionButtons = () => {
    if (!admin) return null;

    const baseButtons = (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="size-4" />
            Voir plus
          </Button>
        </DialogTrigger>
        <InternshipDetailsDialog internship={internship} />
      </Dialog>
    );

    let mainActions: React.ReactNode = null;
    switch (internship.state) {
      case "visible":
        mainActions = (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/${internship.id}/edit`}>
                <Edit className="size-4" />
                Modifier
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={actions.handleSoftDelete}
              disabled={actions.isPending}
            >
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </>
        );
        break;
      case "draft":
        mainActions = (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={actions.handleApprove}
              disabled={actions.isPending}
            >
              <Check className="size-4" />
              Valider
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/${internship.id}/edit`}>
                <Edit className="size-4" />
                Modifier
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={actions.handleSoftDelete}
              disabled={actions.isPending}
            >
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </>
        );
        break;
      case "deleted":
        mainActions = (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={actions.handleRestore}
              disabled={actions.isPending}
            >
              <RotateCcw className="size-4" />
              Restaurer
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </>
        );
        break;
      default:
        mainActions = null;
    }

    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex w-full justify-center gap-2 sm:w-auto sm:justify-start">
          {mainActions}
        </div>
        <div className="flex w-full justify-center sm:w-auto sm:justify-end">{baseButtons}</div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      {admin && actions.deleteDialog}
      <CardHeader className="border-b-2 pb-4">
        <div className="flex w-full items-start justify-between">
          <CardTitle className="text-2xl">{internship.organization.name}</CardTitle>
          {admin && getStateBadge()}
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
        {admin ? (
          getActionButtons()
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Voir plus</Button>
            </DialogTrigger>
            <InternshipDetailsDialog internship={internship} />
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
