import type { Metadata } from "next";
import "@chronos/ui/globals.css";
import type { PropsWithChildren } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Chronos - Stages",
  description: "Répertoire des stages de Télécom Physique Strasbourg",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto flex w-full max-w-screen-md flex-1 flex-col px-5 py-3">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
