import type { Metadata } from "next";
import "@chronos/ui/globals.css";
import type { PropsWithChildren } from "react";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Chronos - Stages",
  description: "Répertoire des stages de Télécom Physique Strasbourg",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <main className="mx-auto flex w-full max-w-screen-md flex-1 flex-col px-5 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
