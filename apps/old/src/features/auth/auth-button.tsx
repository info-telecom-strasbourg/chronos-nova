import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "./auth.action";

export const AuthButton = async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user)
    return (
      <Button size="sm" variant="link" onClick={signOutAction}>
        Se déconnecter
      </Button>
    );

  return (
    <Button size="sm" asChild>
      <Link href="/login">Se connecter</Link>
    </Button>
  );
};
