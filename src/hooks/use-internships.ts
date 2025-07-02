import type { InternshipCardData } from "@/types/database";
import { useCallback, useEffect, useState } from "react";

interface APIResponse {
  success: boolean;
  data?: InternshipCardData[];
  count?: number;
  error?: string;
  details?: string;
}

export function useInternships(sort: string = "most-recent") {
  const [internships, setInternships] = useState<InternshipCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL("/api/internships", window.location.origin);
      url.searchParams.set("sort", sort);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: APIResponse = await response.json();

      if (result.success && result.data) {
        setInternships(result.data);
      } else {
        setError(result.error || "Erreur lors de la récupération des données");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      console.error("Erreur lors de la récupération des stages:", err);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  return { internships, loading, error, refetch: fetchInternships };
}
