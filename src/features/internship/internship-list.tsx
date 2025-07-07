"use client";

import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipHeader } from "@/features/search/internship-header";

export function InternshipList() {
  return (
    <div className="space-y-8 pt-8">
      <InternshipHeader />
      <InternshipInfiniteScroll />
    </div>
  );
}
