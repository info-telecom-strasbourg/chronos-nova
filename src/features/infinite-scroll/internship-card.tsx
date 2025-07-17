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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InternshipConfirmDialogs } from "@/features/admin/internship-confirm-dialogs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { InternshipBadges } from "@/components/ui/internship-badges";
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

type InternshipWithDuplicate = InternshipData & { isDuplicate?: boolean };
type InternshipCardProps = {
  internship: InternshipWithDuplicate;
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
          toast.error("Impossible d'approuver ce stage. Merci de vérifier que toutes les informations sont complètes et valides.");
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
    handleAction(() => restoreInternship(internship.id), "Stage restauré et placé en attente de validation");
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

  const getActionButtons = () => {
    if (!admin) return null;

    return (
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2 sm:gap-0 w-full">
        <div className="flex justify-center sm:justify-start gap-2 w-full sm:w-auto">
          {internship.state === "draft" && (
            <>
              <Button variant="default" size="sm" onClick={handleApprove} disabled={isPending}>
                <Check className="mr-1 w-4 h-4" />
                Approuver
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-1 w-4 h-4" />
                Modifier
              </Button>
              <InternshipConfirmDialogs
                type="single-draft"
                onConfirm={handleSoftDelete}
                disabled={isPending}
              >
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <Trash2 className="mr-1 w-4 h-4" />
                  Supprimer
                </Button>
              </InternshipConfirmDialogs>
            </>
          )}

          {internship.state === "visible" && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-1 w-4 h-4" />
                Modifier
              </Button>
              <InternshipConfirmDialogs
                type="single-visible"
                onConfirm={handleSoftDelete}
                disabled={isPending}
              >
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <Trash2 className="mr-1 w-4 h-4" />
                  Supprimer
                </Button>
              </InternshipConfirmDialogs>
            </>
          )}

          {internship.state === "deleted" && (
            <>
              <Button variant="default" size="sm" onClick={handleRestore} disabled={isPending}>
                <RefreshCw className="mr-1 w-4 h-4" />
                Restaurer
              </Button>
              <InternshipConfirmDialogs
                type="single-deleted"
                onConfirm={handleHardDelete}
                disabled={isPending}
              >
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <AlertTriangle className="mr-1 w-4 h-4" />
                  Supprimer définitivement
                </Button>
              </InternshipConfirmDialogs>
            </>
          )}
        </div>

        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-1 w-4 h-4" />
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
      <CardHeader className="pb-4 border-b-2">
        <div className="flex justify-between items-start w-full">
          <CardTitle className="text-2xl">{getTitleLabel(internship.organization.name)}</CardTitle>
          {admin && (
            <div className="flex flex-wrap gap-2">
              <InternshipBadges
                state={internship.state as "visible" | "draft" | "deleted"}
                isInvalid={internship.isInvalid}
                isDuplicate={internship.isDuplicate}
                showState={true}
              />
            </div>
          )}
        </div>
        <CardDescription>
          <span className="inline-flex items-center gap-1">
            <Building className="inline w-4 h-4 align-text-bottom" />
            {getOrganizationTypeLabel(internship.organization.type)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-4 px-6 font-thin text-justify">
        <p className="mb-7">{getSubjectLabel(internship.subject)}</p>
        <div className="gap-x-4 gap-y-2 grid grid-cols-1 sm:grid-cols-2 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>
              {getCountryLabel(internship.organization.country)},{" "}
              {getCityLabel(internship.organization.city)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>
              {internship.academicYear}
              {(() => {
                const major = internship.student?.major?.alias;
                const option = internship.student?.option?.alias;
                // Diplôme
                const majorLabel =
                  !major || major === "__inconnu__" ? "??" : getMajorShortLabel(major);
                // Option
                let optionLabel = "";
                if (option && option !== "aucune") {
                  optionLabel = option === "__inconnu__" ? "??" : getOptionShortLabel(option);
                }
                return ` - ${majorLabel}${optionLabel ? ` - ${optionLabel}` : ""}`;
              })()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{getWeeksLabel(internship.weeksCount)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar1 className="w-4 h-4" />
            <span>{getDateLabel(internship.beginDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center sm:justify-between gap-2">
        {admin ? (
          getActionButtons()
        ) : (
          <div className="flex justify-center sm:justify-end w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 w-4 h-4" />
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
