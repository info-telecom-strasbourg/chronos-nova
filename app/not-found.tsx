import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2">
      <AlertTriangle className="size-12 text-destructive" />
      <div className="text-center">
        <h1 className="font-bold text-2xl">Page non trouvée</h1>
        <p className="text-center text-muted-foreground">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <Home className="size-4" />
          Retourner à l’accueil
        </Link>
      </Button>
    </div>
  );
}
