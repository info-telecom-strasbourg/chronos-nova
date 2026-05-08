"use client";

import type { Internship } from "@chronos/db/src/queries/admin-internship.query";
import { Badge } from "@chronos/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@chronos/ui/components/table";
import { cn } from "@chronos/ui/lib/utils";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import {
  type ColumnKey,
  type SortField,
  useAdminFilters,
} from "@/hooks/use-admin-filters";
import { InternshipActionsDropdown } from "./internship-actions-dropdown";
import { InternshipDetailDialog } from "./internship-detail-dialog";

const STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  visible: { label: "Publié", variant: "default" },
  pending: { label: "En attente", variant: "secondary" },
  deleted: { label: "Supprimé", variant: "destructive" },
};

function SortIcon({
  field,
  active,
  dir,
}: {
  field: SortField;
  active: SortField | null;
  dir: "asc" | "desc";
}) {
  if (active !== field)
    return <ArrowUpDown className="ml-1 inline size-3 opacity-40" />;
  return dir === "asc" ? (
    <ArrowUp className="ml-1 inline size-3 text-primary" />
  ) : (
    <ArrowDown className="ml-1 inline size-3 text-primary" />
  );
}

export function InternshipTable({
  internships,
}: {
  internships: Internship[];
}) {
  const [selected, setSelected] = useState<Internship | null>(null);
  const { qInput, isVisible, sortField, sortDir, handleSort } =
    useAdminFilters();

  const col = (key: ColumnKey) => isVisible(key);

  if (internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
        <p className="text-sm">
          {qInput ? `Aucun résultat pour « ${qInput} »` : "Aucun stage trouvé"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {col("subject") && (
                <TableHead className="w-[30%]">
                  <button
                    type="button"
                    className="flex cursor-pointer items-center hover:text-foreground"
                    onClick={() => handleSort("subject")}
                  >
                    Sujet
                    <SortIcon
                      field="subject"
                      active={sortField}
                      dir={sortDir}
                    />
                  </button>
                </TableHead>
              )}
              {col("organization") && (
                <TableHead>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center hover:text-foreground"
                    onClick={() => handleSort("organization")}
                  >
                    Organisation
                    <SortIcon
                      field="organization"
                      active={sortField}
                      dir={sortDir}
                    />
                  </button>
                </TableHead>
              )}
              {col("formation") && (
                <TableHead>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center hover:text-foreground"
                    onClick={() => handleSort("academicYear")}
                  >
                    Formation
                    <SortIcon
                      field="academicYear"
                      active={sortField}
                      dir={sortDir}
                    />
                  </button>
                </TableHead>
              )}
              {col("location") && (
                <TableHead>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center hover:text-foreground"
                    onClick={() => handleSort("country")}
                  >
                    Localisation
                    <SortIcon
                      field="country"
                      active={sortField}
                      dir={sortDir}
                    />
                  </button>
                </TableHead>
              )}
              {col("period") && (
                <TableHead>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center hover:text-foreground"
                    onClick={() => handleSort("beginDate")}
                  >
                    Période
                    <SortIcon
                      field="beginDate"
                      active={sortField}
                      dir={sortDir}
                    />
                  </button>
                </TableHead>
              )}
              {col("status") && <TableHead>Statut</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {internships.map((internship) => {
              const status = STATUS_LABELS[internship.status];
              const hasIssues =
                Array.isArray(internship.issues) &&
                internship.issues.length > 0;

              return (
                <TableRow
                  key={internship.id}
                  className={cn(
                    "cursor-pointer",
                    hasIssues && "bg-amber-50/50 dark:bg-amber-950/10",
                  )}
                  onClick={() => setSelected(internship)}
                >
                  {col("subject") && (
                    <TableCell className="max-w-0">
                      <div className="flex items-start gap-2">
                        {hasIssues && (
                          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                        )}
                        <p className="min-w-0 truncate font-medium">
                          {internship.subject ?? (
                            <span className="text-muted-foreground italic">
                              Sans sujet
                            </span>
                          )}
                        </p>
                      </div>
                    </TableCell>
                  )}

                  {col("organization") && (
                    <TableCell className="text-muted-foreground">
                      {internship.organizationName ? (
                        <span className="flex items-center gap-1">
                          <Building2 className="size-3 shrink-0" />
                          <span className="truncate">
                            {internship.organizationName}
                          </span>
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>
                  )}

                  {col("formation") && (
                    <TableCell className="text-muted-foreground">
                      {internship.academicYear && (
                        <span className="font-medium text-foreground">
                          {internship.academicYear}
                        </span>
                      )}
                      {internship.major && (
                        <span className="ml-1 text-xs">
                          · {internship.major}
                        </span>
                      )}
                      {internship.option && internship.option !== "aucune" && (
                        <span className="ml-1 text-xs">
                          / {internship.option}
                        </span>
                      )}
                    </TableCell>
                  )}

                  {col("location") && (
                    <TableCell className="text-muted-foreground">
                      {internship.city || internship.country ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 shrink-0" />
                          {[internship.city, internship.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>
                  )}

                  {col("period") && (
                    <TableCell className="text-muted-foreground">
                      {internship.beginDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 shrink-0" />
                          {internship.beginDate}
                          {internship.weeksCount && (
                            <span className="text-xs">
                              · {internship.weeksCount} sem.
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>
                  )}

                  {col("status") && (
                    <TableCell>
                      {status && (
                        <Badge variant={status.variant}>{status.label}</Badge>
                      )}
                    </TableCell>
                  )}

                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InternshipActionsDropdown internship={internship} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <InternshipDetailDialog
          internship={selected}
          open={!!selected}
          onOpenChange={(v) => !v && setSelected(null)}
        />
      )}
    </>
  );
}
