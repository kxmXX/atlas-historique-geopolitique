import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/Layout/ClientLayout";

export const metadata: Metadata = {
  title: "Atlas historique & géopolitique",
  description: "Carte éducative interactive pour explorer les dynamiques historiques et géopolitiques par période, territoire et source.",
  openGraph: {
    title: "Atlas historique & géopolitique",
    description: "Carte éducative interactive, gratuite et sourcée.",
    type: "website",
    locale: "fr_FR"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a435c"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
