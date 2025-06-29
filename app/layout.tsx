import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";
import type { LayoutParams } from "@/types/next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  description: "Télécom Physique Strasbourg's student internship directory",
  title: "Chronos",
};

export default function RootLayout({ children }: LayoutParams) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-1 flex-col px-5 py-3">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
