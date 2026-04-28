import { AdPlacement, Prisma } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";

let sponsorModuleTableCheck: Promise<boolean> | null = null;

export const adPlacementLabels: Record<AdPlacement, string> = {
  HOME_TOP: "Home superior",
  HOME_MIDDLE: "Home intermediario",
  PORTAL_SIDEBAR: "Portal lateral",
  PORTAL_BOTTOM: "Portal rodape",
  REPORTS_BOTTOM: "Demandas rodape",
  FOOTER_SUPPORTERS: "Rodape apoiadores",
};

export const defaultAdSlots = [
  {
    title: "Home top",
    slug: "home-top",
    description: "Banner institucional discreto logo apos a abertura principal da home.",
    placement: AdPlacement.HOME_TOP,
    size: "1200x320",
  },
  {
    title: "Home middle",
    slug: "home-middle",
    description: "Espaco de apoio institucional no miolo da home publica.",
    placement: AdPlacement.HOME_MIDDLE,
    size: "1200x240",
  },
  {
    title: "Portal sidebar",
    slug: "portal-sidebar",
    description: "Espaco lateral para apoiadores e banners institucionais no portal.",
    placement: AdPlacement.PORTAL_SIDEBAR,
    size: "420x320",
  },
  {
    title: "Portal bottom",
    slug: "portal-bottom",
    description: "Espaco de rodape para parceiros do territorio na pagina do portal.",
    placement: AdPlacement.PORTAL_BOTTOM,
    size: "1200x220",
  },
  {
    title: "Reports bottom",
    slug: "reports-bottom",
    description: "Apoio comunitario no rodape da pagina de demandas.",
    placement: AdPlacement.REPORTS_BOTTOM,
    size: "1200x220",
  },
  {
    title: "Footer supporters",
    slug: "footer-supporters",
    description: "Lista de apoiadores ativos no rodape publico.",
    placement: AdPlacement.FOOTER_SUPPORTERS,
    size: "fluid",
  },
] as const;

const publicAdvertisementInclude = {
  sponsor: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      websiteUrl: true,
      whatsappUrl: true,
      category: true,
      isActive: true,
    },
  },
  adSlot: {
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      placement: true,
      size: true,
      isActive: true,
    },
  },
} satisfies Prisma.AdvertisementInclude;

function getActiveAdvertisementWhere(now = new Date()): Prisma.AdvertisementWhereInput {
  return {
    isActive: true,
    startsAt: { lte: now },
    OR: [{ endsAt: null }, { endsAt: { gte: now } }],
    sponsor: { isActive: true },
    adSlot: { isActive: true },
  };
}

export async function getActiveAdvertisementsByPlacement(placement: AdPlacement) {
  if (!hasDatabaseUrl() || !(await hasSponsorModuleTables())) return [];

  try {
    return await prisma.advertisement.findMany({
      where: {
        ...getActiveAdvertisementWhere(),
        adSlot: {
          placement,
          isActive: true,
        },
      },
      include: publicAdvertisementInclude,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getActiveSponsors() {
  if (!hasDatabaseUrl() || !(await hasSponsorModuleTables())) return [];

  try {
    return await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getSponsorOverview() {
  if (!hasDatabaseUrl() || !(await hasSponsorModuleTables())) {
    return {
      activeSponsors: 0,
      activeCampaigns: 0,
      availableSlots: 0,
      sponsors: [],
      slots: [],
      advertisements: [],
    };
  }

  try {
    const now = new Date();
    const [sponsors, slots, advertisements] = await Promise.all([
      prisma.sponsor.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        include: {
          _count: {
            select: { advertisements: true },
          },
        },
      }),
      prisma.adSlot.findMany({
        orderBy: [{ placement: "asc" }, { title: "asc" }],
        include: {
          _count: {
            select: { advertisements: true },
          },
        },
      }),
      prisma.advertisement.findMany({
        include: publicAdvertisementInclude,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    const activeAdvertisements = advertisements.filter((ad) => {
      const endsAtValid = !ad.endsAt || ad.endsAt >= now;
      return ad.isActive && ad.startsAt <= now && endsAtValid && ad.sponsor.isActive && ad.adSlot.isActive;
    });

    const slotIdsWithActiveCampaign = new Set(activeAdvertisements.map((ad) => ad.adSlotId));

    return {
      activeSponsors: sponsors.filter((sponsor) => sponsor.isActive).length,
      activeCampaigns: activeAdvertisements.length,
      availableSlots: slots.filter((slot) => slot.isActive && !slotIdsWithActiveCampaign.has(slot.id)).length,
      sponsors,
      slots,
      advertisements,
    };
  } catch {
    return {
      activeSponsors: 0,
      activeCampaigns: 0,
      availableSlots: 0,
      sponsors: [],
      slots: [],
      advertisements: [],
    };
  }
}

export async function buildSponsorSlug(name: string, excludeId?: string) {
  return await buildUniqueSlug("sponsor", slugify(name), excludeId);
}

export async function buildAdSlotSlug(title: string, excludeId?: string) {
  return await buildUniqueSlug("adSlot", slugify(title), excludeId);
}

function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

async function buildUniqueSlug(model: "sponsor" | "adSlot", baseSlug: string, excludeId?: string) {
  if (!hasDatabaseUrl()) return baseSlug;

  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing =
      model === "sponsor"
        ? await prisma.sponsor.findFirst({
            where: {
              slug: candidate,
              ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
            select: { id: true },
          })
        : await prisma.adSlot.findFirst({
            where: {
              slug: candidate,
              ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
            select: { id: true },
          });

    if (!existing) return candidate;

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

async function hasSponsorModuleTables() {
  if (sponsorModuleTableCheck) {
    return sponsorModuleTableCheck;
  }

  sponsorModuleTableCheck = prisma
    .$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('Sponsor', 'AdSlot', 'Advertisement')
    `
    .then((rows) => rows.length === 3)
    .catch(() => false);

  return sponsorModuleTableCheck;
}
