"use client";

import { GetInternshipsParamsValidator } from "@chronos/db/src/validators/internship.validator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getInternshipsAction } from "@/actions/internship.action";

const LIMIT = 10;

export function useInternships() {
  const [q] = useQueryState("q", { defaultValue: "" });
  const [sort] = useQueryState("sort", { defaultValue: "most-recent" });
  const [order] = useQueryState("order", { defaultValue: "asc" });
  const [year] = useQueryState("year", { defaultValue: "" });
  const [major] = useQueryState("major", { defaultValue: "" });
  const [option] = useQueryState("option", { defaultValue: "" });
  const [country] = useQueryState("country", { defaultValue: "" });

  const validSort =
    GetInternshipsParamsValidator.shape.sort.safeParse(sort).data;
  const validOrder =
    GetInternshipsParamsValidator.shape.order.safeParse(order).data;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: [
        "internships",
        { q, sort: validSort, order: validOrder, year, major, option, country },
      ],
      queryFn: ({ pageParam }) =>
        getInternshipsAction({
          page: pageParam,
          limit: LIMIT,
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

  const { ref: sentinelRef, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const lastPage = data?.pages[data.pages.length - 1];
  const totalItems = lastPage?.pagination.total ?? 0;
  const internships = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    internships,
    totalItems,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef,
  };
}
