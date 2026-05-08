"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import { Badge } from "@chronos/ui/components/badge";
import { Button } from "@chronos/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@chronos/ui/components/card";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  MapPin,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  approveInternshipAction,
  hardDeleteInternshipAction,
} from "@/actions/internship.action";
import { EditInternshipDialog } from "./edit-internship-dialog";

export function PendingInternshipCard({
  internship,
  onProcessed,
}: {
  internship: Internship;
  onProcessed?: () => void;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const issues = (internship.issues as string[] | null) ?? [];

  async function approve() {
    setLoading("approve");
    try {
      await approveInternshipAction(internship.id);
      toast.success("Stage approuvé et publié");
      onProcessed?.();
    } catch {
      toast.error("Erreur lors de l'approbation");
    } finally {
      setLoading(null);
    }
  }

  async function reject() {
    setLoading("reject");
    try {
      await hardDeleteInternshipAction(internship.id);
      toast.success("Stage rejeté et supprimé");
      onProcessed?.();
    } catch {
      toast.error("Erreur lors du rejet");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card
      className={
        issues.length > 0 ? "border-amber-300 dark:border-amber-700" : undefined
      }
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            {internship.subject ?? (
              <span className="text-muted-foreground italic">Sans sujet</span>
            )}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            {issues.length > 0 && (
              <Badge
                variant="outline"
                className="gap-1 border-amber-400 text-amber-600 dark:border-amber-600 dark:text-amber-400"
              >
                <AlertTriangle className="size-3" />
                {issues.length} problème{issues.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {internship.organizationName && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" />
              <span className="truncate">{internship.organizationName}</span>
            </div>
          )}
          {(internship.city || internship.country) && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {[internship.city, internship.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {internship.beginDate && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              <span>
                {internship.beginDate}
                {internship.weeksCount && ` · ${internship.weeksCount} sem.`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>
              {[internship.academicYear, internship.major, internship.option]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        </div>

        {issues.length > 0 && (
          <ul className="space-y-1 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
            {issues.map((issue, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-amber-700 text-xs dark:text-amber-400"
              >
                <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <EditInternshipDialog internship={internship} />
        <div className="ml-auto flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={reject}
            disabled={loading !== null}
          >
            <X className="size-4" />
            Rejeter
          </Button>
          <Button size="sm" onClick={approve} disabled={loading !== null}>
            <Check className="size-4" />
            {loading === "approve" ? "Approbation…" : "Approuver"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
