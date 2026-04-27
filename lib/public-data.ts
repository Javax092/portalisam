import { Prisma } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";
import {
  buildPublicReportWhere,
  getPaginationMeta,
  normalizePage,
  publicReportsPageSize,
} from "@/lib/reports";

const emptyReportStats: Array<{ status: string; _count: { _all: number } }> = [];

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
    return {
      notices: [],
      events: [],
      reportStats: emptyReportStats,
      recentReports: [],
    };
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
  } catch {
    return {
      notices: [],
      events: [],
      reportStats: emptyReportStats,
      recentReports: [],
    };
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
      pagination: getPaginationMeta(0, 1, publicReportsPageSize),
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
  } catch {
    return {
      reports: [],
      pagination: getPaginationMeta(0, 1, publicReportsPageSize),
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
  } catch {
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
  } catch {
    return [];
  }
}
