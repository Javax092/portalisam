import { Prisma } from "@prisma/client";

import { hasDatabaseUrl, logDatabaseError, prisma } from "@/lib/db/prisma";
import {
  buildPublicReportWhere,
  getPaginationMeta,
  normalizePage,
  publicReportsPageSize,
} from "@/lib/reports";
export { getActiveAdvertisementsByPlacement, getActiveSponsors, getSponsorOverview } from "@/lib/sponsors";

const emptyReportStats: Array<{ status: string; _count: { _all: number } }> = [];
const emptyPortalOverview = {
  notices: [],
  events: [],
  reportStats: emptyReportStats,
  recentReports: [],
};

const publicReportSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  severity: true,
  status: true,
  priority: true,
  address: true,
  neighborhood: true,
  latitude: true,
  longitude: true,
  imageUrl: true,
  managerComment: true,
  createdAt: true,
  updatedAt: true,
  relevantUpdatedAt: true,
} satisfies Prisma.ReportSelect;

export async function getPortalOverview() {
  if (!hasDatabaseUrl()) {
    return emptyPortalOverview;
  }

  try {
    const [notices, events, reportStats, recentReports] = await Promise.all([
      prisma.notice.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.event.findMany({
        where: { isActive: true, startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 4,
      }),
      prisma.report.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.report.findMany({
        select: publicReportSelect,
        orderBy: [{ relevantUpdatedAt: "desc" }, { createdAt: "desc" }],
        take: 3,
      }),
    ]);

    return {
      notices,
      events,
      reportStats,
      recentReports,
    };
  } catch (error) {
    logDatabaseError("getPortalOverview", error);
    return emptyPortalOverview;
  }
}

export async function getPublicReports(filters?: {
  query?: string;
  category?: string;
  status?: string;
  priority?: string;
  neighborhood?: string;
  page?: number;
}) {
  if (!hasDatabaseUrl()) {
    return {
      reports: [],
      pagination: getPaginationMeta(0, normalizePage(filters?.page), publicReportsPageSize),
    };
  }

  const page = normalizePage(filters?.page);
  const where = buildPublicReportWhere(filters);

  try {
    const [totalItems, reports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        select: publicReportSelect,
        orderBy: [{ relevantUpdatedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * publicReportsPageSize,
        take: publicReportsPageSize,
      }),
    ]);

    return {
      reports,
      pagination: getPaginationMeta(totalItems, page, publicReportsPageSize),
    };
  } catch (error) {
    logDatabaseError("getPublicReports", error, { page });
    return {
      reports: [],
      pagination: getPaginationMeta(0, page, publicReportsPageSize),
    };
  }
}

export async function getPublicNotices() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    return await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    });
  } catch (error) {
    logDatabaseError("getPublicNotices", error);
    return [];
  }
}

export async function getPublicEvents() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    return await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { startsAt: "asc" },
      take: 10,
    });
  } catch (error) {
    logDatabaseError("getPublicEvents", error);
    return [];
  }
}
