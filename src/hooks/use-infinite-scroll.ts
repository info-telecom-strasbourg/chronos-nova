import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  loadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  loadMore,
  threshold = 300,
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadingRef.current;
    if (!el || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0,
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    observer.observe(el);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [hasNextPage, isLoading, loadMore, threshold]);

  return loadingRef;
}
