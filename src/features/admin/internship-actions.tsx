"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  approveInternship,
  restoreInternship,
  softDeleteInternship,
} from "@/features/infinite-scroll/internship.query";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

interface InternshipActionsProps {
  internshipId: string;
  onStateChange?: () => void;
}

export function InternshipActions({ internshipId, onStateChange }: InternshipActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    startTransition(async () => {
      try {
        await action();
        toast.success(successMessage);
        onStateChange?.();
        router.refresh(); // Refresh the page to update the lists
      } catch (error) {
        toast.error("Une erreur s'est produite");
        console.error(error);
      }
    });
  };

  const handleSoftDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setShowDeleteDialog(false);
    handleAction(() => softDeleteInternship(internshipId), "Stage supprimé avec succès");
  };

  const handleApprove = () => {
    handleAction(() => approveInternship(internshipId), "Stage approuvé avec succès");
  };

  const handleRestore = () => {
    handleAction(() => restoreInternship(internshipId), "Stage restauré avec succès");
  };

  return {
    handleSoftDelete,
    handleApprove,
    handleRestore,
    isPending,
    deleteDialog: (
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Supprimer le stage"
        description="Êtes-vous sûr de vouloir supprimer ce stage ? Il sera déplacé vers la section supprimés."
      />
    ),
  };
}
