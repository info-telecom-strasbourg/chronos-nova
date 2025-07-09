"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { pluralize } from "@/lib/scripts/string";
import { getInternshipsQuery } from "./internship.query";
import { InternshipCard } from "./internship-card";
import { InternshipListSkeleton, InternshipPaginationSkeleton } from "./internship-skeleton";

export type InternshipInfiniteScrollProps = {
  initialPage?: number;
  limit?: number;
  totalItems: number;
  admin?: boolean;
};

export const InternshipInfiniteScroll = ({
  initialPage = 0,
  limit = 10,
  totalItems,
  admin = false,
}: InternshipInfiniteScrollProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ["internships"],
    queryFn: ({ pageParam }) => getInternshipsQuery({ page: pageParam, limit }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allInternships = data?.pages?.flatMap((page) => page.data) || [];

  const loadedInternshipsCount = allInternships.length;
  const remainingInternships = totalItems - loadedInternshipsCount;
  const skeletonsToShow = Math.min(limit, remainingInternships);

  if (isPending) {
    return <InternshipListSkeleton admin={admin} />;
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
