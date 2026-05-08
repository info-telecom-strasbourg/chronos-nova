import { getAdminInternships } from "@chronos/db/src/queries/admin-internship.query";
import { Suspense } from "react";
import { BulkApproveButton } from "@/components/internship/bulk-approve-button";
import { PendingInternshipCard } from "@/components/internship/pending-internship-card";

async function PendingList() {
  const { data } = await getAdminInternships({
    page: 0,
    limit: 500,
    status: "pending",
  });

  const withIssues = data.filter(
    (i) => Array.isArray(i.issues) && i.issues.length > 0,
  );
  const clean = data.filter(
    (i) => !Array.isArray(i.issues) || i.issues.length === 0,
  );

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-muted-foreground">
        <p className="text-sm">Aucun stage en attente</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {clean.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              Sans problème ({clean.length})
            </h2>
            <BulkApproveButton internships={data} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clean.map((i) => (
              <PendingInternshipCard key={i.id} internship={i} />
            ))}
          </div>
        </section>
      )}

      {withIssues.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">
            Avec problèmes — vérification requise ({withIssues.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {withIssues.map((i) => (
              <PendingInternshipCard key={i.id} internship={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function PendingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl">Stages en attente</h1>
        <p className="text-muted-foreground text-sm">
          Stages importés ou soumis, en attente de validation par un
          administrateur
        </p>
      </div>
      <Suspense
        fallback={
          <div className="rounded-xl border py-16 text-center text-muted-foreground text-sm">
            Chargement…
          </div>
        }
      >
        <PendingList />
      </Suspense>
    </div>
  );
}
