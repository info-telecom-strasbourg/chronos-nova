import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";
import type { LayoutParams } from "@/types/next";

export const metadata: Metadata = {
  description: "Télécom Physique Strasbourg's student internship directory",
  title: "Chronos",
};

export default function RootLayout({ children }: LayoutParams) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
