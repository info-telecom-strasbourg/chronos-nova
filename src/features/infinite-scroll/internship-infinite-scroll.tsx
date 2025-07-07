"use client";

import type { InternshipData } from "@/types/drizzle";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getInternshipsQuery } from "./internship.query";
import { InternshipCard } from "./internship-card";
import { InternshipListSkeleton } from "./internship-skeleton";

export const InternshipInfiniteScroll = () => {
  const searchParams = useSearchParams();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(
    async (pageNum: number): Promise<InternshipData[]> => {
      const { data } = await getInternshipsQuery({
        page: pageNum,
        q: searchParams.get("q") || undefined,
        sort: searchParams.get("sort") as "created_at" | "updated_at" | undefined,
        order: searchParams.get("order") as "asc" | "desc" | undefined,
      });
      return data || [];
    },
    [searchParams],
  );

  useEffect(() => {
    setInternships([]);
    setLoading(true);
    setPage(0);
    setHasMore(true);
    setIsLoadingMore(false);

    loadPage(0).then((data) => {
      setInternships(data);
      setLoading(false);
      setHasMore(data.length === 10);
    });
  }, [loadPage]);

  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore || loading) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newData = await loadPage(nextPage);
      setInternships((prev) => [...prev, ...newData]);
      setPage(nextPage);
      setHasMore(newData.length === 10);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, loading, isLoadingMore, loadPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingMore && hasMore && !loading) {
          loadNextPage();
        }
      },
      { rootMargin: "100px" },
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [loadNextPage, isLoadingMore, hasMore, loading]);

  if (loading) {
    return <InternshipListSkeleton />;
  }

  return (
    <ul className="w-full space-y-4">
      {internships.map((internship, index) => (
        <InternshipCard key={`${internship.id}-${index}`} internship={internship} />
      ))}
      {hasMore && internships.length > 0 && (
        <div ref={observerRef} className="mx-auto flex w-fit items-center gap-2">
          <Spinner />
          <span className="text-muted-foreground text-sm">
            Chargement de plus de stages en cours…
          </span>
        </div>
      )}
      {!hasMore && internships.length > 0 && (
        <div className="mx-auto w-fit pt-2 text-muted-foreground text-sm">
          Tous les stages ont été chargés !
        </div>
      )}
    </ul>
  );
};
