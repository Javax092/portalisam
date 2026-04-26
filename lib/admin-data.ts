import { Prisma, ReportStatus, UserRole } from "@prisma/client";

import { adminReportsPageSize, buildAdminReportWhere, getPaginationMeta, normalizePage } from "@/lib/reports";
import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";

const dashboardFallback = {
  totals: {
    notices: 4,
    events: 4,
    reports: 6,
    openReports: 4,
    resolvedReports: 1,
  },
  recentNotices: [
    {
      id: "fallback-admin-notice-1",
      title: "Acao social neste sabado na quadra do bairro",
      category: "Acao social",
      isFeatured: true,
      updatedAt: new Date("2026-04-20T12:00:00.000Z"),
    },
    {
      id: "fallback-admin-notice-2",
      title: "Reuniao aberta com liderancas comunitarias",
      category: "Participacao comunitaria",
      isFeatured: true,
      updatedAt: new Date("2026-04-19T15:00:00.000Z"),
    },
    {
      id: "fallback-admin-notice-3",
      title: "Campanha de arrecadacao para familias em vulnerabilidade",
      category: "Solidariedade",
      isFeatured: false,
      updatedAt: new Date("2026-04-18T10:00:00.000Z"),
    },
  ],
  recentEvents: [
    {
      id: "fallback-admin-event-1",
      title: "Culto comunitario de gratidao e acolhimento",
      location: "Igreja Comunidade da Esperanca",
      startsAt: new Date("2026-04-24T22:00:00.000Z"),
    },
    {
      id: "fallback-admin-event-2",
      title: "Distribuicao de cestas basicas para familias cadastradas",
      location: "Centro Comunitario Promorar",
      startsAt: new Date("2026-04-25T13:00:00.000Z"),
    },
    {
      id: "fallback-admin-event-3",
      title: "Mutirao de limpeza nas ruas principais",
      location: "Concentracao na Praca Central",
      startsAt: new Date("2026-04-26T12:30:00.000Z"),
    },
  ],
  recentReports: [
    {
      id: "fallback-admin-report-1",
      title: "Poste sem iluminacao perto da escola municipal",
      status: "OPEN",
      priority: "URGENT",
      neighborhood: "Promorar",
      address: "Rua da Escola, esquina com Rua das Flores",
      managerComment: null,
      assignedTo: null,
    },
    {
      id: "fallback-admin-report-2",
      title: "Buraco grande na rua principal proximo ao ponto de onibus",
      status: "IN_REVIEW",
      priority: "HIGH",
      neighborhood: "Promorar",
      address: "Avenida Principal, proximo ao ponto de onibus",
      managerComment: "Registro enviado para avaliacao inicial com apoio das liderancas locais.",
      assignedTo: { id: "fallback-assistant", name: "Equipe local", email: "assistente@isam.org", role: "ASSISTANT" },
    },
    {
      id: "fallback-admin-report-3",
      title: "Lixo acumulado em area de circulacao de pedestres",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      neighborhood: "Nova Esperanca",
      address: "Travessa Nova Vida, ao lado do mercadinho",
      managerComment: "Moradores organizaram um ponto de apoio enquanto aguardam solucao definitiva.",
      assignedTo: null,
    },
    {
      id: "fallback-admin-report-4",
      title: "Calcada danificada em frente ao posto de atendimento",
      status: "RESOLVED",
      priority: "MEDIUM",
      neighborhood: "Promorar",
      address: "Rua do Atendimento, 45",
      managerComment: "A equipe comunitaria informou que o reparo emergencial ja foi realizado.",
      assignedTo: null,
    },
  ],
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
    return dashboardFallback;
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
      recentNotices: recentNotices.length > 0 ? recentNotices : dashboardFallback.recentNotices,
      recentEvents: recentEvents.length > 0 ? recentEvents : dashboardFallback.recentEvents,
      recentReports: recentReports.length > 0 ? recentReports : dashboardFallback.recentReports,
    };
  } catch {
    return dashboardFallback;
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
