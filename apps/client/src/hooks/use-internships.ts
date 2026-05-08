"use client";

import { GetInternshipsParamsValidator } from "@chronos/db/src/validators/internship.validator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getInternshipsAction } from "@/actions/internship.action";

const LIMIT = 10;

function parseMulti(raw: string) {
  return raw ? raw.split(",").filter(Boolean) : [];
}

export function useInternships() {
  const [q] = useQueryState("q", { defaultValue: "" });
  const [sort] = useQueryState("sort", { defaultValue: "most-recent" });
  const [order] = useQueryState("order", { defaultValue: "desc" });
  const [yearRaw] = useQueryState("year", { defaultValue: "" });
  const [majorRaw] = useQueryState("major", { defaultValue: "" });
  const [optionRaw] = useQueryState("option", { defaultValue: "" });
  const [countryRaw] = useQueryState("country", { defaultValue: "" });
  const [cityRaw] = useQueryState("city", { defaultValue: "" });
  const [orgTypeRaw] = useQueryState("orgType", { defaultValue: "" });

  const years = parseMulti(yearRaw);
  const majors = parseMulti(majorRaw);
  const options = parseMulti(optionRaw);
  const countries = parseMulti(countryRaw);
  const cities = parseMulti(cityRaw);
  const orgTypes = parseMulti(orgTypeRaw);

  const validSort =
    GetInternshipsParamsValidator.shape.sort.safeParse(sort).data;
  const validOrder =
    GetInternshipsParamsValidator.shape.order.safeParse(order).data;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: [
        "internships",
        {
          q,
          sort: validSort,
          order: validOrder,
          yearRaw,
          majorRaw,
          optionRaw,
          countryRaw,
          cityRaw,
          orgTypeRaw,
        },
      ],
      queryFn: ({ pageParam }) =>
        getInternshipsAction({
          page: pageParam,
          limit: LIMIT,
          q,
          sort: validSort,
          order: validOrder,
          academicYear: years.length
            ? (years as ("1A" | "2A" | "3A")[])
            : undefined,
          major: majors.length ? majors : undefined,
          option: options.length ? options : undefined,
          country: countries.length ? countries : undefined,
          city: cities.length ? cities : undefined,
          organizationType: orgTypes.length
            ? (orgTypes as ("company" | "not_company")[])
            : undefined,
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
