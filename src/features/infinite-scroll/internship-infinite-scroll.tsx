"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { pluralize } from "@/lib/scripts/string";
import { getInternshipsQuery } from "./internship.query";
import { InternshipCard } from "./internship-card";
import { InternshipListSkeleton, InternshipPaginationSkeleton } from "./internship-skeleton";

export type InternshipInfiniteScrollProps = {
  initialPage?: number;
  limit?: number;
  admin?: boolean;
  state?: "visible" | "draft" | "deleted";
};

export const InternshipInfiniteScroll = ({
  initialPage = 0,
  limit = 10,
  admin = false,
  state,
}: InternshipInfiniteScrollProps) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ["internships", { state, q: searchQuery }],
    queryFn: ({ pageParam }) =>
      getInternshipsQuery({
        page: pageParam,
        limit,
        state,
        q: searchQuery || undefined,
      }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allInternships = data?.pages?.flatMap((page) => page.data) || [];
  const lastPage = data?.pages?.[data?.pages?.length - 1] || data?.pages?.[0];
  const totalItems = lastPage?.total ?? 0;
  const loadedInternships = allInternships.length;
  const remainingInternships = totalItems - loadedInternships;
  const skeletonsToShow = Math.min(limit, remainingInternships);

  if (isPending) {
    return <InternshipListSkeleton admin={admin} />;
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
              admin={admin}
            />
          )),
        )}
        {hasNextPage && isFetchingNextPage && skeletonsToShow > 0 && (
          <>
            <InternshipPaginationSkeleton count={skeletonsToShow} admin={admin} />
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
};
