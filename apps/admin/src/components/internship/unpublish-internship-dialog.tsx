"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import { Button } from "@chronos/ui/components/button";
import { EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { unpublishInternshipAction } from "@/actions/internship.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function UnpublishInternshipDialog({
  internship,
  onDone,
}: {
  internship: Internship;
  onDone?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUnpublish() {
    setLoading(true);
    try {
      await unpublishInternshipAction(internship.id);
      toast.success("Stage dépublié — repassé en attente");
      onDone?.();
    } catch {
      toast.error("Erreur lors de la dépublication");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon-sm" disabled={loading}>
          <EyeOff className="size-3.5" />
          <span className="sr-only">Dépublier</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dépublier le stage ?</AlertDialogTitle>
          <AlertDialogDescription>
            Le stage &ldquo;
            {internship.subject ?? internship.organizationName ?? "Sans titre"}
            &rdquo; ne sera plus visible dans l&apos;annuaire et repassera en
            attente de validation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnpublish}>
            Dépublier
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
