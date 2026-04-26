import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";

import "@/app/globals.css";
import { AppShell } from "@/components/public/app-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "portal comunitario",
    "igrejas",
    "ongs",
    "associacao de bairro",
    "lideranca comunitaria",
    "promorar conectado",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
