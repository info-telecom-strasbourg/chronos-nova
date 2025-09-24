"use client";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Error500() {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2">
      <AlertTriangle className="size-12 text-destructive" />
      <div className="text-center">
        <h1 className="font-bold text-2xl">Erreur serveur</h1>
        <p className="text-muted-foreground">Connexion au serveur impossible.</p>
        <p className="text-muted-foreground">Veuillez réessayer plus tard.</p>
      </div>
      <Button onClick={() => router.refresh()}>
        <RefreshCw className="mr-2 size-4" />
        Réessayer
      </Button>
    </div>
  );
}
