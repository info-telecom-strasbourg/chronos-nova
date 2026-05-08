"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@chronos/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS, useAdminFilters } from "@/hooks/use-admin-filters";

interface InternshipPaginationProps {
  total: number;
}

function buildPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages: (number | "ellipsis")[] = [];
  pages.push(0);
  if (current > 3) pages.push("ellipsis");
  for (
    let i = Math.max(1, current - 1);
    i <= Math.min(total - 2, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 4) pages.push("ellipsis");
  pages.push(total - 1);
  return pages;
}

export function InternshipPagination({ total }: InternshipPaginationProps) {
  const { page, limit, handlePageChange, handleLimitChange } =
    useAdminFilters();
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1 && PAGE_SIZE_OPTIONS.length <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <span>Lignes par page</span>
        <Select
          value={String(limit)}
          onValueChange={(v) => handleLimitChange(Number(v))}
        >
          <SelectTrigger className="h-7 w-16 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          {Math.min(page * limit + 1, total)}–
          {Math.min((page + 1) * limit, total)} sur {total}
        </span>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 0) handlePageChange(page - 1);
                }}
                aria-disabled={page === 0}
                className={page === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`e${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(p);
                    }}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages - 1) handlePageChange(page + 1);
                }}
                aria-disabled={page >= totalPages - 1}
                className={
                  page >= totalPages - 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
