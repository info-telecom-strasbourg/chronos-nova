"use client";

import type { InternshipFormData } from "@chronos/db/src/validators/admin-internship.validator";
import { Button } from "@chronos/ui/components/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createInternshipAction } from "@/actions/internship.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InternshipForm } from "./internship-form";

export function CreateInternshipDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: InternshipFormData) {
    setLoading(true);
    try {
      await createInternshipAction(data);
      toast.success("Stage créé et mis en attente de validation");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de la création du stage");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Ajouter un stage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un stage</DialogTitle>
        </DialogHeader>
        <InternshipForm
          onSubmit={handleSubmit}
          submitLabel="Créer"
          isLoading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
