"use client";

import type { InternshipData } from "@/types/drizzle";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { getInternshipsQuery } from "./internship.query";
import { InternshipCard } from "./internship-card";

export type InternshipInfiniteScrollProps = {
  initialInternships: Array<InternshipData>;
};

export const InternshipInfiniteScroll = ({ initialInternships }: InternshipInfiniteScrollProps) => {
  const searchParams = useSearchParams(); // TODO: implement search params handling in loadInternships function

  const loadInternships = async (page: number) => {
    const { data } = await getInternshipsQuery({ page });
    return data;
  };

  const {
    data: internships,
    hasMore,
    ref,
  } = useInfiniteScroll({
    initialData: initialInternships,
    loadMore: loadInternships,
    initialPage: 1,
  });

  return (
    <ul className="w-full space-y-4">
      {internships.map((internship) => (
        <InternshipCard key={internship.id} internship={internship} />
      ))}
      {hasMore && (
        <div ref={ref} className="mx-auto w-fit">
          <Spinner />
        </div>
      )}
    </ul>
  );
};
