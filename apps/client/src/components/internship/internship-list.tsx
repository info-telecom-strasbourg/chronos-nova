"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { fetchInternships } from "@/actions/internship.action";
import { pluralize } from "@/lib/utils";
import { InternshipCard } from "./internship-card";
import {
  InternshipListSkeleton,
  InternshipPaginationSkeleton,
} from "./internship-skeleton";

export function InternshipList() {
  const limit = 10;

  const [q] = useQueryState("q", { defaultValue: "" });
  const [sort] = useQueryState("sort", { defaultValue: "most-recent" });
  const [order] = useQueryState("order", { defaultValue: "asc" });
  const [year] = useQueryState("year", { defaultValue: "" });
  const [major] = useQueryState("major", { defaultValue: "" });
  const [option] = useQueryState("option", { defaultValue: "" });
  const [country] = useQueryState("country", { defaultValue: "" });

  const validSort = [
    "most-recent",
    "organization",
    "duration",
    "location",
  ].includes(sort)
    ? (sort as "most-recent" | "organization" | "duration" | "location")
    : undefined;
  const validOrder = ["asc", "desc"].includes(order)
    ? (order as "asc" | "desc")
    : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: [
        "internships",
        { q, sort: validSort, order: validOrder, year, major, option, country },
      ],
      queryFn: ({ pageParam }) =>
        fetchInternships({
          page: pageParam,
          limit,
          q: q || undefined,
          sort: validSort,
          order: validOrder,
          academicYear: ["1A", "2A", "3A"].includes(year)
            ? (year as "1A" | "2A" | "3A")
            : undefined,
          major: major || undefined,
          option: option || undefined,
          country: country || undefined,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page + 1 < totalPages ? page + 1 : undefined;
      },
    });

  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allInternships = data?.pages?.flatMap((page) => page.data) || [];
  const lastPage = data?.pages?.[data.pages.length - 1] || data?.pages?.[0];
  const totalItems = lastPage?.pagination.total ?? 0;
  const loadedInternships = allInternships.length;
  const remainingInternships = totalItems - loadedInternships;
  const skeletonsToShow = Math.min(limit, remainingInternships);

  if (isPending) {
    return <InternshipListSkeleton />;
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Search className="m-3 size-10 text-muted-foreground" />
        <div className="text-center">
          <h1 className="font-semibold text-lg">Aucun stage trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm">
          {pluralize(totalItems, "stage trouvé", "stages trouvés")}
        </p>
      </div>
      <ul className="w-full space-y-4">
        {data?.pages.flatMap((page) =>
          page.data?.map((internship, index) => (
            <InternshipCard
              key={`${internship.id}-${index}`}
              internship={internship}
            />
          )),
        )}
        {hasNextPage && isFetchingNextPage && skeletonsToShow > 0 && (
          <>
            <InternshipPaginationSkeleton count={skeletonsToShow} />
            <div ref={ref} />
          </>
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        {!hasNextPage && allInternships.length > 0 && (
          <div className="mx-auto w-fit pt-2 text-muted-foreground text-sm">
            Tous les stages ont été chargés !
          </div>
        )}
      </ul>
    </>
  );
}
