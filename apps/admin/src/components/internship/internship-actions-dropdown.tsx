"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import type { InternshipFormData } from "@chronos/db/src/validators/admin-internship.validator";
import { Button } from "@chronos/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@chronos/ui/components/dropdown-menu";
import { EyeOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteInternshipAction,
  unpublishInternshipAction,
  updateInternshipAction,
} from "@/actions/internship.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InternshipForm } from "./internship-form";

export function InternshipActionsDropdown({
  internship,
}: {
  internship: Internship;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unpublishOpen, setUnpublishOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues: Partial<InternshipFormData> = {
    subject: internship.subject ?? undefined,
    beginDate: internship.beginDate ?? undefined,
    endDate: internship.endDate ?? undefined,
    weeksCount: internship.weeksCount ?? undefined,
    major: internship.major ?? undefined,
    option: internship.option ?? undefined,
    academicYear: internship.academicYear ?? undefined,
    organizationName: internship.organizationName ?? undefined,
    organizationType: internship.organizationType ?? undefined,
    country: internship.country ?? undefined,
    city: internship.city ?? undefined,
  };

  async function handleEdit(data: InternshipFormData) {
    setLoading(true);
    try {
      await updateInternshipAction(internship.id, data);
      toast.success("Stage modifié");
      setEditOpen(false);
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteInternshipAction(internship.id);
      toast.success("Stage supprimé");
      setDeleteOpen(false);
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnpublish() {
    setLoading(true);
    try {
      await unpublishInternshipAction(internship.id);
      toast.success("Stage dépublié — repassé en attente");
      setUnpublishOpen(false);
    } catch {
      toast.error("Erreur lors de la dépublication");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Actions</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Modifier
          </DropdownMenuItem>
          {internship.status === "visible" && (
            <DropdownMenuItem onSelect={() => setUnpublishOpen(true)}>
              <EyeOff className="size-4" />
              Dépublier
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le stage</DialogTitle>
          </DialogHeader>
          <InternshipForm
            defaultValues={defaultValues}
            onSubmit={handleEdit}
            submitLabel="Enregistrer"
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={unpublishOpen} onOpenChange={setUnpublishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dépublier le stage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le stage &ldquo;
              {internship.subject ??
                internship.organizationName ??
                "Sans titre"}
              &rdquo; ne sera plus visible dans l&apos;annuaire et repassera en
              attente de validation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnpublish} disabled={loading}>
              Dépublier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le stage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le stage &ldquo;
              {internship.subject ??
                internship.organizationName ??
                "Sans titre"}
              &rdquo; sera marqué comme supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
