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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { InternshipEditDialog } from "@/features/form/internship-edit-dialog";
import {
  approveInternship,
  hardDeleteInternship,
  restoreInternship,
  softDeleteInternship,
} from "@/features/infinite-scroll/internship.query";
import {
  getCityLabel,
  getCountryLabel,
  getDateLabel,
  getMajorShortLabel,
  getOptionShortLabel,
  getOrganizationTypeLabel,
  getSubjectLabel,
  getTitleLabel,
  getWeeksLabel,
} from "@/features/parser/mappings";
import { InternshipDetailsDialog } from "./internship-details-dialog";

type InternshipCardProps = {
  internship: InternshipData;
  admin?: boolean;
};

export function InternshipCard({ internship, admin }: InternshipCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    startTransition(async () => {
      try {
        const result = await approveInternship(internship.id);
        if (!result.success) {
          toast.error(result.message || "Impossible d'approuver ce stage");
          return;
        }
        await queryClient.invalidateQueries({ queryKey: ["internships"] });
        router.refresh();
        toast.success("Stage approuvé avec succès");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Une erreur s'est produite lors de l'approbation";
        toast.error(errorMessage);
      }
    });
  };

  const handleRestore = () => {
    handleAction(() => restoreInternship(internship.id), "Stage restauré avec succès");
  };

  const getEditDefaultValues = () => ({
    organizationName: internship.organization?.name || "",
    organizationType: internship.organization?.type || undefined,
    organizationCountry: internship.organization?.country || "",
    organizationCity: internship.organization?.city || "",
    subject: internship.subject || "",
    academicYear: internship.academicYear || undefined,
    beginDate: internship.beginDate || "",
    weeksCount: internship.weeksCount || undefined,
    // Traiter "__inconnu__" comme undefined pour le formulaire d'édition
    studentMajor:
      internship.student?.major?.alias === "__inconnu__"
        ? undefined
        : internship.student?.major?.alias || undefined,
    studentOption:
      internship.student?.option?.alias === "__inconnu__"
        ? undefined
        : internship.student?.option?.alias || undefined,
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

    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex w-full justify-center gap-2 sm:w-auto sm:justify-start">
          {internship.state === "draft" && (
            <>
              <Button variant="default" size="sm" onClick={handleApprove} disabled={isPending}>
                <Check className="mr-1 h-4 w-4" />
                Approuver
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-1 h-4 w-4" />
                Modifier
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
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-1 h-4 w-4" />
                Modifier
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
          <CardTitle className="text-2xl">{getTitleLabel(internship.organization.name)}</CardTitle>
          {admin && getStateBadge()}
        </div>
        <CardDescription>
          <span className="inline-flex items-center gap-1">
            <Building className="inline h-4 w-4 align-text-bottom" />
            {getOrganizationTypeLabel(internship.organization.type)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-4 px-6 text-justify font-thin">
        <p className="mb-7">{getSubjectLabel(internship.subject)}</p>
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
              {internship.academicYear}
              {/* Diplôme : toujours afficher, "??" si inconnu */}
              {(() => {
                const major = internship.student?.major?.alias;
                const option = internship.student?.option?.alias;
                if (!major || major === "__inconnu__") {
                  // Diplôme inconnu : afficher ?? et la filière (?? si inconnue)
                  return ` - ??${option ? ` - ${option === "__inconnu__" ? "??" : getOptionShortLabel(option)}` : ""}`;
                } else {
                  // Diplôme connu : afficher le label, puis la filière si pertinente
                  return (
                    <>
                      {` - ${getMajorShortLabel(major)}`}
                      {option && option !== "aucune" && option !== "__inconnu__"
                        ? ` - ${getOptionShortLabel(option)}`
                        : ""}
                    </>
                  );
                }
              })()}
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

      {admin && (
        <InternshipEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          internshipId={internship.id}
          defaultValues={getEditDefaultValues()}
        />
      )}
    </Card>
  );
}
