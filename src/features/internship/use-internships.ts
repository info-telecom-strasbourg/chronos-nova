import type { InternshipCardData } from "@/types/database";
import { useCallback, useEffect, useState } from "react";

interface APIResponse {
  success: boolean;
  data?: InternshipCardData[];
  totalCount?: number;
  hasMore?: boolean;
  currentPage?: number;
  error?: string;
}

export function useInternships(sort: string = "most-recent") {
  const [internships, setInternships] = useState<InternshipCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchInternships = useCallback(
    async (page = 1, append = false) => {
      try {
        page === 1 ? setLoading(true) : setLoadingMore(true);
        setError(null);

        const url = new URL("/api/internships", window.location.origin);
        url.searchParams.set("sort", sort);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", "10");

        const res = await fetch(url.toString());
        const result: APIResponse = await res.json();

        if (result.success && result.data) {
          setInternships((prev) =>
            append ? [...prev, ...(result.data || [])] : result.data || [],
          );
          setHasMore(Boolean(result.hasMore));
          setCurrentPage(result.currentPage || 1);
          setTotalCount(result.totalCount || 0);
        } else {
          setError(result.error || "Erreur lors de la récupération des données");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort],
  );

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(false);
    fetchInternships(1, false);
  }, [fetchInternships]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchInternships(currentPage + 1, true);
    }
  };

  return {
    internships,
    loading,
    loadingMore,
    error,
    hasMore,
    totalCount,
    loadMore,
    refetch: () => fetchInternships(1, false),
  };
}
