"use client";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error500() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 p-4 min-h-[60vh]">
      <AlertTriangle className="size-12 text-destructive" />
      <h1 className="font-bold text-2xl">Erreur serveur</h1>
      <p className="text-muted-foreground text-center">
        Connexion à la base de données impossible.
        <br />
        Veuillez réessayer plus tard.
      </p>
      <Button onClick={() => window.location.reload()} className="w-full max-w-xs">
        <RefreshCw className="mr-2 size-4" />
        Réessayer
      </Button>
    </div>
  );
}
