"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import { Button } from "@chronos/ui/components/button";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { bulkApproveAction } from "@/actions/internship.action";
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

export function BulkApproveButton({
  internships,
}: {
  internships: Internship[];
}) {
  const [loading, setLoading] = useState(false);

  const clean = internships.filter(
    (i) => !Array.isArray(i.issues) || i.issues.length === 0,
  );

  async function handleBulkApprove() {
    setLoading(true);
    try {
      await bulkApproveAction(clean.map((i) => i.id));
      toast.success(`${clean.length} stage(s) approuvé(s)`);
    } catch {
      toast.error("Erreur lors de l'approbation en masse");
    } finally {
      setLoading(false);
    }
  }

  if (clean.length === 0) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" disabled={loading}>
          <CheckCheck className="size-4" />
          Approuver {clean.length} stage{clean.length > 1 ? "s" : ""} sans
          problème
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approbation en masse</AlertDialogTitle>
          <AlertDialogDescription>
            {clean.length} stage{clean.length > 1 ? "s" : ""} sans problème
            détecté vont être publiés dans l'annuaire. Les stages avec des
            problèmes restent en attente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleBulkApprove}>
            Approuver
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
