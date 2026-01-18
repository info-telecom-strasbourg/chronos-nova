"use client";

import type { ReactNode } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface InternshipConfirmDialogsProps {
  children: ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  type: "single-draft" | "single-visible" | "single-deleted" | "all-drafts" | "all-deleted";
}

export function InternshipConfirmDialogs({
  children,
  onConfirm,
  disabled = false,
  type,
}: InternshipConfirmDialogsProps) {
  const getDialogConfig = () => {
    switch (type) {
      case "single-draft":
      case "single-visible":
        return {
          title: "Supprimer le stage",
          description:
            "Êtes-vous sûr de vouloir supprimer ce stage ? Il sera déplacé vers la section supprimés.",
          confirmText: "Supprimer",
        };

      case "single-deleted":
        return {
          title: "Suppression définitive",
          description:
            "ATTENTION : Cette action est irréversible ! Le stage sera définitivement supprimé de la base de données et ne pourra pas être récupéré.",
          confirmText: "Supprimer définitivement",
        };

      case "all-drafts":
        return {
          title: "Supprimer tous les stages",
          description:
            "Êtes-vous sûr de vouloir supprimer tous les stages en attente ? Ils seront déplacés vers la section supprimés.",
          confirmText: "Supprimer tout",
        };

      case "all-deleted":
        return {
          title: "Suppression définitive",
          description:
            "ATTENTION : Cette action est irréversible ! Tous les stages supprimés seront définitivement supprimés de la base de données et ne pourront pas être récupérés.",
          confirmText: "Supprimer définitivement",
        };

      default:
        return {
          title: "Confirmer l'action",
          description: "Êtes-vous sûr de vouloir effectuer cette action ?",
          confirmText: "Confirmer",
        };
    }
  };

  const config = getDialogConfig();

  return (
    <ConfirmDialog
      title={config.title}
      description={config.description}
      confirmText={config.confirmText}
      variant="destructive"
      onConfirm={onConfirm}
      disabled={disabled}
    >
      {children}
    </ConfirmDialog>
  );
}
