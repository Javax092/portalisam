import { AdPlacement, type Prisma } from "@prisma/client";

import { hasDatabaseUrl, logDatabaseError, prisma } from "@/lib/db/prisma";

export const adBannerPositions = [
  "portal_top",
  "portal_between_sections",
  "portal_sidebar",
  "portal_footer",
] as const;

export type AdBannerPosition = (typeof adBannerPositions)[number];

export const adBannerPositionLabels: Record<AdBannerPosition, string> = {
  portal_top: "Topo do portal",
  portal_between_sections: "Entre secoes",
  portal_sidebar: "Lateral ou bloco secundario",
  portal_footer: "Rodape discreto",
};

export const adBannerPositionDescriptions: Record<AdBannerPosition, string> = {
  portal_top: "Area nobre e discreta logo apos a abertura principal da pagina.",
  portal_between_sections: "Bloco institucional entre secoes editoriais.",
  portal_sidebar: "Card secundario para areas laterais ou colunas auxiliares.",
  portal_footer: "Faixa elegante no fim da experiencia publica.",
};

export const legacyPlacementByPosition: Partial<Record<AdBannerPosition, AdPlacement>> = {
  portal_top: AdPlacement.HOME_TOP,
  portal_between_sections: AdPlacement.HOME_MIDDLE,
  portal_sidebar: AdPlacement.PORTAL_SIDEBAR,
  portal_footer: AdPlacement.PORTAL_BOTTOM,
};

let adBannerTableCheck: Promise<boolean> | null = null;

const publicAdBannerSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  link: true,
  isActive: true,
  priority: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AdBannerSelect;

export async function getAdminAdBanners() {
  if (!hasDatabaseUrl() || !(await hasAdBannerTable())) {
    return [];
  }

  try {
    return await prisma.adBanner.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      select: publicAdBannerSelect,
    });
  } catch (error) {
    logDatabaseError("getAdminAdBanners", error);
    return [];
  }
}

export async function getActiveAdBannersByPosition(position: AdBannerPosition, take?: number) {
  if (!hasDatabaseUrl() || !(await hasAdBannerTable())) {
    return [];
  }

  try {
    return await prisma.adBanner.findMany({
      where: {
        isActive: true,
        position,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take,
      select: publicAdBannerSelect,
    });
  } catch (error) {
    logDatabaseError("getActiveAdBannersByPosition", error, { position });
    return [];
  }
}

async function hasAdBannerTable() {
  if (adBannerTableCheck) {
    return adBannerTableCheck;
  }

  adBannerTableCheck = prisma
    .$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'AdBanner'
    `
    .then((rows) => rows.length === 1)
    .catch(() => false);

  return adBannerTableCheck;
}
