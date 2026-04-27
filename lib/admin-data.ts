import { Prisma, ReportStatus, UserRole } from "@prisma/client";

import { adminReportsPageSize, buildAdminReportWhere, getPaginationMeta, normalizePage } from "@/lib/reports";
import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";

const emptyDashboardData = {
  totals: {
    notices: 0,
    events: 0,
    reports: 0,
    openReports: 0,
    resolvedReports: 0,
  },
  recentNotices: [],
  recentEvents: [],
  recentReports: [],
} as const;

const reportListSelect = {
  id: true,
  title: true,
  category: true,
  status: true,
  priority: true,
  neighborhood: true,
  address: true,
  createdAt: true,
  updatedAt: true,
  relevantUpdatedAt: true,
  lastActivityAt: true,
  managerComment: true,
  firstResponseDueAt: true,
  resolutionDueAt: true,
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  _count: {
    select: {
      comments: true,
      activities: true,
      notifications: true,
    },
  },
} satisfies Prisma.ReportSelect;

export async function getAdminDashboardData() {
  if (!hasDatabaseUrl()) {
    return emptyDashboardData;
  }

  try {
    const [noticeCount, eventCount, reportCount, openReports, resolvedReports, recentNotices, recentEvents, recentReports] =
      await Promise.all([
        prisma.notice.count(),
        prisma.event.count(),
        prisma.report.count(),
        prisma.report.count({
          where: { status: { in: [ReportStatus.OPEN, ReportStatus.IN_REVIEW, ReportStatus.IN_PROGRESS] } },
        }),
        prisma.report.count({ where: { status: ReportStatus.RESOLVED } }),
        prisma.notice.findMany({ orderBy: { updatedAt: "desc" }, take: 3 }),
        prisma.event.findMany({ orderBy: [{ startsAt: "asc" }, { updatedAt: "desc" }], take: 3 }),
        prisma.report.findMany({
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            neighborhood: true,
            address: true,
            managerComment: true,
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: [{ lastActivityAt: "desc" }, { updatedAt: "desc" }],
          take: 4,
        }),
      ]);

    return {
      totals: {
        notices: noticeCount,
        events: eventCount,
        reports: reportCount,
        openReports,
        resolvedReports,
      },
      recentNotices,
      recentEvents,
      recentReports,
    };
  } catch {
    return emptyDashboardData;
  }
}

export async function getAdminNotices() {
  if (!hasDatabaseUrl()) return [];

  try {
    return await prisma.notice.findMany({
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getAdminEvents() {
  if (!hasDatabaseUrl()) return [];

  try {
    return await prisma.event.findMany({
      orderBy: [{ startsAt: "asc" }, { updatedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getAssignableUsers() {
  if (!hasDatabaseUrl()) return [];

  try {
    return await prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          in: [UserRole.ASSISTANT, UserRole.ADMIN],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: [{ role: "desc" }, { name: "asc" }, { email: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getAdminReports(filters?: {
  query?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedToUserId?: string;
  page?: number;
}) {
  if (!hasDatabaseUrl()) {
    return {
      reports: [],
      pagination: getPaginationMeta(0, 1, adminReportsPageSize),
    };
  }

  const page = normalizePage(filters?.page);
  const where = buildAdminReportWhere(filters);

  try {
    const [totalItems, reports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        select: reportListSelect,
        orderBy: [{ lastActivityAt: "desc" }, { relevantUpdatedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * adminReportsPageSize,
        take: adminReportsPageSize,
      }),
    ]);

    return {
      reports,
      pagination: getPaginationMeta(totalItems, page, adminReportsPageSize),
    };
  } catch {
    return {
      reports: [],
      pagination: getPaginationMeta(0, 1, adminReportsPageSize),
    };
  }
}

export async function getAdminReportById(id: string) {
  if (!hasDatabaseUrl()) return null;

  try {
    return await prisma.report.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        comments: {
          include: {
            authorUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        activities: {
          include: {
            actorUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } catch {
    return null;
  }
}
