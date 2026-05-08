"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import { Badge } from "@chronos/ui/components/badge";
import { Separator } from "@chronos/ui/components/separator";
import { Building2, Calendar, GraduationCap, MapPin, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MAJOR_LABELS,
  OPTION_LABELS,
  ORGANIZATION_TYPES,
} from "@/lib/constants";
import { DeleteInternshipDialog } from "./delete-internship-dialog";
import { EditInternshipDialog } from "./edit-internship-dialog";
import { UnpublishInternshipDialog } from "./unpublish-internship-dialog";

const STATUS_LABELS = {
  visible: { label: "Publié", variant: "default" as const },
  pending: { label: "En attente", variant: "secondary" as const },
  deleted: { label: "Supprimé", variant: "destructive" as const },
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium text-sm">
        {value ?? (
          <span className="text-muted-foreground italic">Non renseigné</span>
        )}
      </p>
    </div>
  );
}

export function InternshipDetailDialog({
  internship,
  open,
  onOpenChange,
}: {
  internship: Internship;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const status = STATUS_LABELS[internship.status];
  const orgTypeLabel = ORGANIZATION_TYPES.find(
    (t) => t.value === internship.organizationType,
  )?.label;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2 pr-6">
            <DialogTitle className="text-base leading-snug">
              {internship.subject ?? (
                <span className="text-muted-foreground italic">Sans sujet</span>
              )}
            </DialogTitle>
            {status && <Badge variant={status.variant}>{status.label}</Badge>}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
              <Building2 className="size-4" />
              Organisation
            </div>
            <div className="grid grid-cols-2 gap-3 pl-6">
              <Field label="Nom" value={internship.organizationName} />
              <Field label="Type" value={orgTypeLabel} />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
              <MapPin className="size-4" />
              Localisation
            </div>
            <div className="grid grid-cols-2 gap-3 pl-6">
              <Field label="Pays" value={internship.country} />
              <Field label="Ville" value={internship.city} />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
              <Calendar className="size-4" />
              Période
            </div>
            <div className="grid grid-cols-3 gap-3 pl-6">
              <Field label="Début" value={internship.beginDate} />
              <Field label="Fin" value={internship.endDate} />
              <Field
                label="Durée"
                value={
                  internship.weeksCount
                    ? `${internship.weeksCount} semaines`
                    : null
                }
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-muted-foreground text-sm">
              <GraduationCap className="size-4" />
              Formation
            </div>
            <div className="grid grid-cols-3 gap-3 pl-6">
              <Field label="Année" value={internship.academicYear} />
              <Field
                label="Diplôme"
                value={
                  internship.major
                    ? (MAJOR_LABELS[internship.major] ?? internship.major)
                    : null
                }
              />
              <Field
                label="Option"
                value={
                  internship.option
                    ? (OPTION_LABELS[internship.option] ?? internship.option)
                    : null
                }
              />
            </div>
          </section>

          {Array.isArray(internship.issues) && internship.issues.length > 0 && (
            <>
              <Separator />
              <section className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-amber-600 text-sm dark:text-amber-400">
                  <Tag className="size-4" />
                  Problèmes détectés
                </div>
                <ul className="space-y-1 pl-6">
                  {(internship.issues as string[]).map((issue, i) => (
                    <li
                      key={i}
                      className="text-amber-700 text-sm dark:text-amber-400"
                    >
                      · {issue}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <EditInternshipDialog internship={internship} />
          {internship.status === "visible" && (
            <UnpublishInternshipDialog
              internship={internship}
              onDone={() => onOpenChange(false)}
            />
          )}
          <DeleteInternshipDialog internship={internship} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
