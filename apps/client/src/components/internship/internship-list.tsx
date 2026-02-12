"use client";

import { GetInternshipsParamsValidator } from "@chronos/db/src/validators/internship.validator";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@chronos/ui/components/empty";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getInternshipsAction } from "@/actions/internship.action";
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

  const validSort =
    GetInternshipsParamsValidator.pick({
      sort: true,
    }).safeParse(sort).data?.sort ?? undefined;
  const validOrder =
    GetInternshipsParamsValidator.pick({
      order: true,
    }).safeParse(order).data?.order ?? undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: [
        "internships",
        {
          q,
          sort: validSort,
          order: validOrder,
          year,
          major,
          option,
          country,
        },
      ],
      queryFn: ({ pageParam }) =>
        getInternshipsAction({
          page: pageParam,
          limit,
          q,
          sort: validSort,
          order: validOrder,
          academicYear: year || undefined,
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

  const lastPage = data?.pages?.[data.pages.length - 1] || data?.pages?.[0];
  const totalItems = lastPage?.pagination.total ?? 0;

  if (isPending) {
    return <InternshipListSkeleton />;
  }

  if (totalItems === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyTitle>Aucun stage trouvé</EmptyTitle>
          <EmptyDescription>Essayer avec d'autres filtres</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <p className="text-muted-foreground text-sm">
        {pluralize(totalItems, "stage trouvé", "stages trouvés")}
      </p>
      <ul className="space-y-4">
        {data?.pages.flatMap((page) =>
          page.data?.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          )),
        )}
        {isFetchingNextPage && (
          <>
            <InternshipPaginationSkeleton count={3} />
            <div ref={ref} />
          </>
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        {!hasNextPage && (
          <div className="mx-auto w-fit pt-2 text-muted-foreground text-sm">
            Tous les stages ont été chargés !
          </div>
        )}
      </ul>
    </>
  );
}
