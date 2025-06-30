import type { PageParams } from "@/types/next";
import { InternshipListClient } from "../src/features/internship/internship-list-client";

export default async function RoutePage(_: PageParams) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 pt-8">
      <InternshipListClient key="internship-list-client" />
    </div>
  );
}
