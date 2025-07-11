import type { InternshipData } from "@/types/drizzle";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Building,
  Calendar1,
  Check,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  MapPin,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  approveInternship,
  hardDeleteInternship,
  restoreInternship,
  softDeleteInternship,
} from "@/features/infinite-scroll/internship.query";
import { InternshipDetailsDialog } from "./internship-details-dialog";

type InternshipCardProps = {
  internship: InternshipData;
  admin?: boolean;
};

export function InternshipCard({ internship, admin }: InternshipCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    startTransition(async () => {
      try {
        await action();

        await queryClient.invalidateQueries({ queryKey: ["internships"] });

        router.refresh();

        toast.success(successMessage);
      } catch (error) {
        toast.error("Une erreur s'est produite");
        console.error(error);
      }
    });
  };

  const handleSoftDelete = () => {
    handleAction(() => softDeleteInternship(internship.id), "Stage supprimé avec succès");
  };

  const handleHardDelete = () => {
    handleAction(() => hardDeleteInternship(internship.id), "Stage supprimé définitivement");
  };

  const handleApprove = () => {
    handleAction(() => approveInternship(internship.id), "Stage approuvé avec succès");
  };

  const handleRestore = () => {
    handleAction(() => restoreInternship(internship.id), "Stage restauré avec succès");
  };

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

    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex w-full justify-center gap-2 sm:w-auto sm:justify-start">
          {internship.state === "draft" && (
            <>
              <Button variant="default" size="sm" onClick={handleApprove} disabled={isPending}>
                <Check className="mr-1 h-4 w-4" />
                Approuver
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/${internship.id}/edit`}>
                  <Edit className="mr-1 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              <ConfirmDialog
                title="Supprimer le stage"
                description="Êtes-vous sûr de vouloir supprimer ce stage ? Il sera déplacé vers la section supprimés."
                confirmText="Supprimer"
                variant="destructive"
                onConfirm={handleSoftDelete}
                disabled={isPending}
              >
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Supprimer
                </Button>
              </ConfirmDialog>
            </>
          )}

          {internship.state === "visible" && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/${internship.id}/edit`}>
                  <Edit className="mr-1 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              <ConfirmDialog
                title="Supprimer le stage"
                description="Êtes-vous sûr de vouloir supprimer ce stage ? Il sera déplacé vers la section supprimés."
                confirmText="Supprimer"
                variant="destructive"
                onConfirm={handleSoftDelete}
                disabled={isPending}
              >
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Supprimer
                </Button>
              </ConfirmDialog>
            </>
          )}

          {internship.state === "deleted" && (
            <>
              <Button variant="default" size="sm" onClick={handleRestore} disabled={isPending}>
                <RefreshCw className="mr-1 h-4 w-4" />
                Restaurer
              </Button>
              <ConfirmDialog
                title="Suppression définitive"
                description="ATTENTION : Cette action est irréversible ! Le stage sera définitivement supprimé de la base de données et ne pourra pas être récupéré."
                confirmText="Supprimer définitivement"
                variant="destructive"
                onConfirm={handleHardDelete}
                disabled={isPending}
              >
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Supprimer définitivement
                </Button>
              </ConfirmDialog>
            </>
          )}
        </div>

        <div className="flex w-full justify-center sm:w-auto sm:justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-1 h-4 w-4" />
                Voir plus
              </Button>
            </DialogTrigger>
            <InternshipDetailsDialog internship={internship} />
          </Dialog>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
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
          <div className="flex w-full justify-center sm:justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-4 w-4" />
                  Voir plus
                </Button>
              </DialogTrigger>
              <InternshipDetailsDialog internship={internship} />
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
