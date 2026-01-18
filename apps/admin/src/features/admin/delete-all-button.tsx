"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InternshipConfirmDialogs } from "@/features/admin/internship-confirm-dialogs";
import { deleteAllDeleted, deleteAllDrafts } from "@/features/infinite-scroll/internship.query";
import { pluralize } from "@/lib/scripts/string";

interface DeleteAllButtonProps {
  /** L'état des stages sur lesquels agir */
  state: "draft" | "deleted";
}

export function DeleteAllButton({ state }: DeleteAllButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [isPending, startTransition] = useTransition();

  // Désactiver le bouton si une recherche est active
  const isSearchActive = searchQuery.length > 0;
  const isDisabled = isPending || isSearchActive;

  const handleDeleteAll = () => {
    // Vérifier si une recherche est active
    if (isSearchActive) {
      toast.error("Veuillez effacer la recherche avant de supprimer tous les stages");
      return;
    }

    startTransition(async () => {
      try {
        let result;

        if (state === "draft") {
          result = await deleteAllDrafts();
        } else {
          result = await deleteAllDeleted();
        }

        if (result.deletedCount === 0) {
          toast.info("Aucun stage à supprimer");
          return;
        }

        // Invalidate queries
        await queryClient.invalidateQueries({ queryKey: ["internships"] });

        // Refresh the page
        router.refresh();

        // Show success message
        const message =
          state === "draft"
            ? `${pluralize(result.deletedCount, "stage supprimé", "stages supprimés")} avec succès`
            : `${pluralize(result.deletedCount, "stage supprimé", "stages supprimés")} définitivement`;

        toast.success(message);
      } catch (error) {
        console.error("Erreur lors de la suppression en masse:", error);
        toast.error("Une erreur s'est produite lors de la suppression");
      }
    });
  };

  const dialogType = state === "draft" ? "all-drafts" : "all-deleted";

  return (
    <InternshipConfirmDialogs type={dialogType} onConfirm={handleDeleteAll} disabled={isDisabled}>
      <Button variant="destructive" size="lg" disabled={isDisabled}>
        <Trash2 className="mr-2 size-5" />
        Supprimer tout
      </Button>
    </InternshipConfirmDialogs>
  );
}
