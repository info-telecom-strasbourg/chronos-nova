import type { PageParams } from "@/types/next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RoutePage(_: PageParams) {
  const supabase = await createSupabaseServerClient();

  const { data: instruments } = await supabase.from("instruments").select("*");

  return <div>{JSON.stringify(instruments, null, 2)}</div>;
}
