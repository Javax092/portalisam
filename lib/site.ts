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
    "ISAM Conectado é o portal comunitário da ONG ISAM para informar moradores, divulgar ações sociais, registrar demandas do território e aproximar apoiadores da comunidade.",
  organizationDescription:
    "Portal comunitário da ONG ISAM para comunicação, ações sociais e demandas do território.",
  url: getSiteUrl(),
  nav: [
    { href: "/", label: "Início" },
    { href: "/portal", label: "Portal" },
    { href: "/reports", label: "Demandas" },
    { href: "/report", label: "Reportar problema" },
    { href: "/login", label: "Entrar" },
  ],
  whatsappAdsMessage,
  whatsappAdsLink: createWhatsAppLink(baseSiteConfig.whatsappAdsNumber, whatsappAdsMessage),
  whatsappCommunityLink: createWhatsAppLink(
    baseSiteConfig.whatsappCommunityNumber,
    "Olá! Quero falar com a equipe da ONG ISAM sobre o portal comunitário.",
  ),
} as const;
