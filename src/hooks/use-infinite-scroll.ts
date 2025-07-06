import { useCallback, useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";

export type UseInfiniteScrollOptions<T> = {
  initialData: T[];
  loadMore: (page: number) => Promise<T[] | null>;
  initialPage?: number;
};

export const useInfiniteScroll = <T>({
  initialData,
  loadMore,
  initialPage = 1,
}: UseInfiniteScrollOptions<T>) => {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: "500px",
  });

  const loadNextPage = useCallback(() => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
      const nextPage = page + 1;
      const newData = await loadMore(nextPage);
      if (newData && newData.length > 0) {
        setPage(nextPage);
        setData((prev) => [...prev, ...newData]);
      } else {
        setHasMore(false);
      }
    });
  }, [hasMore, loadMore, isPending, page]);

  useEffect(() => {
    if (inView && hasMore && !isPending) {
      loadNextPage();
    }
  }, [inView, hasMore, loadNextPage, isPending]);

  return { data, hasMore, ref, isPending };
};
