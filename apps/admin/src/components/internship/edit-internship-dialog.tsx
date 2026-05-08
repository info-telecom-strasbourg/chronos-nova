"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import type { InternshipFormData } from "@chronos/db/src/validators/admin-internship.validator";
import { Button } from "@chronos/ui/components/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateInternshipAction } from "@/actions/internship.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InternshipForm } from "./internship-form";

export function EditInternshipDialog({
  internship,
}: {
  internship: Internship;
}) {
  const [open, setOpen] = useState(false);
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

  async function handleSubmit(data: InternshipFormData) {
    setLoading(true);
    try {
      await updateInternshipAction(internship.id, data);
      toast.success("Stage modifié");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Pencil className="size-3.5" />
          <span className="sr-only">Modifier</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le stage</DialogTitle>
        </DialogHeader>
        <InternshipForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel="Enregistrer"
          isLoading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
