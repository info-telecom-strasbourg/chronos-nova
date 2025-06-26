import type { PageParams } from "@/types/next";
import { InternshipListClient } from "../src/features/internship/internship-list-client";

export default async function RoutePage(_: PageParams) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <InternshipListClient key="internship-list-client" />
    </div>
  );
}
