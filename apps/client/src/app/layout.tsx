import type { Metadata } from "next";
import "@chronos/ui/globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import type { LayoutParams } from "@/types/next";

export const metadata: Metadata = {
  title: "Chronos",
  description: "Répertoire des stages de Télécom Physique Strasbourg",
};

export default function RootLayout({ children }: LayoutParams) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto mb-auto w-full max-w-screen-lg px-5 py-9">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
