import {
  getAdminInternshipFilterOptions,
  getAdminInternships,
} from "@chronos/db/src/queries/admin-internship.query";
import { Suspense } from "react";
import { CreateInternshipDialog } from "@/components/internship/create-internship-dialog";
import { ExcelImportDialog } from "@/components/internship/excel-import-dialog";
import { InternshipPagination } from "@/components/internship/internship-pagination";
import { InternshipTable } from "@/components/internship/internship-table";
import { InternshipToolbar } from "@/components/internship/internship-toolbar";
import type { SortField } from "@/hooks/use-admin-filters";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    limit?: string;
    year?: string;
    major?: string;
    option?: string;
    country?: string;
    city?: string;
    orgType?: string;
    sort?: string;
    dir?: string;
  }>;
}

function parseMulti(raw: string | undefined) {
  return raw ? raw.split(",").filter(Boolean) : undefined;
}

const SORT_FIELDS = [
  "subject",
  "organization",
  "academicYear",
  "country",
  "beginDate",
];

async function InternshipContent({
  searchParams,
}: {
  searchParams: Awaited<PageProps["searchParams"]>;
}) {
  const page = Math.max(0, Number(searchParams.page ?? 0));
  const limit = Number(searchParams.limit ?? 20);

  const [{ data, pagination }, filterOptions] = await Promise.all([
    getAdminInternships({
      q: searchParams.q || undefined,
      status: "visible",
      page,
      limit: Number.isNaN(limit) || limit <= 0 ? 20 : limit,
      years: parseMulti(searchParams.year),
      majors: parseMulti(searchParams.major),
      options: parseMulti(searchParams.option),
      countries: parseMulti(searchParams.country),
      cities: parseMulti(searchParams.city),
      orgTypes: parseMulti(searchParams.orgType),
      sortField: (SORT_FIELDS.includes(searchParams.sort ?? "")
        ? searchParams.sort
        : undefined) as SortField | undefined,
      sortDir: searchParams.dir === "desc" ? "desc" : "asc",
    }),
    getAdminInternshipFilterOptions("visible"),
  ]);

  return (
    <>
      <InternshipToolbar filterOptions={filterOptions} />
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs">
          {pagination.total} stage{pagination.total !== 1 ? "s" : ""}
          {searchParams.q ? ` pour « ${searchParams.q} »` : ""}
        </p>
        <InternshipTable internships={data} />
        <InternshipPagination total={pagination.total} />
      </div>
    </>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Stages publiés</h1>
          <p className="text-muted-foreground text-sm">
            Stages visibles dans l'annuaire
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExcelImportDialog />
          <CreateInternshipDialog />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-xl border py-16 text-center text-muted-foreground text-sm">
            Chargement…
          </div>
        }
      >
        <InternshipContent searchParams={params} />
      </Suspense>
    </div>
  );
}
