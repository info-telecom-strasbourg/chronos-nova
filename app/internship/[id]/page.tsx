import type { PageParams } from "@/types/next";

export default async function RoutePage({ params }: PageParams<{ id: string }>) {
  const { id } = await params;
  return <div>{id}</div>;
}
