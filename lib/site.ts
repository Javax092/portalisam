import { siteConfig as baseSiteConfig } from "@/lib/site-config";
import { createWhatsAppLink } from "@/lib/whatsapp";

const whatsappAdsMessage =
  "Olá! Quero apoiar a ONG ISAM e saber como anunciar no portal ISAM Conectado.";

function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (siteUrl) {
    return siteUrl;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://example.com";
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  ...baseSiteConfig,
  name: process.env.NEXT_PUBLIC_APP_NAME || baseSiteConfig.appName,
  description:
    "ISAM Conectado e o portal institucional da ONG ISAM para comunicacao publica, registros comunitarios, agenda institucional e acompanhamento territorial.",
  organizationDescription:
    "Portal institucional da ONG ISAM para comunicacao oficial, governanca local e acompanhamento territorial.",
  url: getSiteUrl(),
  nav: [
    { href: "/", label: "Início" },
    { href: "/portal", label: "Portal publico" },
    { href: "/reports", label: "Demandas" },
    { href: "/report", label: "Registrar demanda" },
    { href: "/login", label: "Acesso administrativo" },
  ],
  whatsappAdsMessage,
  whatsappAdsLink: createWhatsAppLink(baseSiteConfig.whatsappAdsNumber, whatsappAdsMessage),
  whatsappCommunityLink: createWhatsAppLink(
    baseSiteConfig.whatsappCommunityNumber,
    "Ola! Quero falar com a equipe da ONG ISAM sobre o portal institucional.",
  ),
} as const;
