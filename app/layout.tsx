import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { LayoutParams } from "@/types/next";

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
          <main className="flex-1 mx-auto px-5 py-3 w-full max-w-screen-xl min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
