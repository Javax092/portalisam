import { Prisma } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";
import { buildPublicReportWhere, getPaginationMeta, normalizePage, publicReportsPageSize } from "@/lib/reports";

const portalFallbackNotices = [
  {
    id: "fallback-notice-1",
    title: "Mutirao de limpeza e escuta comunitaria neste sabado",
    description:
      "Moradores, voluntarios e liderancas locais vao se reunir para cuidar de pontos criticos do bairro e ouvir prioridades da comunidade.",
    category: "Mobilizacao local",
    isFeatured: true,
    publishedAt: new Date("2026-04-20T13:00:00.000Z"),
    createdAt: new Date("2026-04-20T13:00:00.000Z"),
  },
  {
    id: "fallback-notice-2",
    title: "Atendimento social com orientacao para familias",
    description:
      "A equipe comunitaria vai receber moradores para encaminhamentos, orientacoes e apoio em demandas urgentes.",
    category: "Atendimento comunitario",
    isFeatured: true,
    publishedAt: new Date("2026-04-18T14:30:00.000Z"),
    createdAt: new Date("2026-04-18T14:30:00.000Z"),
  },
  {
    id: "fallback-notice-3",
    title: "Campanha de arrecadacao segue ate sexta-feira",
    description:
      "Continuamos recebendo alimentos, produtos de higiene e roupas em bom estado para familias acompanhadas no territorio.",
    category: "Solidariedade",
    isFeatured: false,
    publishedAt: new Date("2026-04-17T15:00:00.000Z"),
    createdAt: new Date("2026-04-17T15:00:00.000Z"),
  },
];

const portalFallbackEvents = [
  {
    id: "fallback-event-1",
    title: "Roda de conversa com liderancas e moradores",
    description:
      "Encontro aberto para ouvir demandas do bairro, alinhar prioridades e fortalecer a participacao local.",
    location: "Sala comunitaria do Promorar",
    startsAt: new Date("2026-04-24T23:00:00.000Z"),
    imageUrl: null,
    createdAt: new Date("2026-04-20T10:00:00.000Z"),
  },
  {
    id: "fallback-event-2",
    title: "Acao social com apoio a familias cadastradas",
    description:
      "Distribuicao organizada com voluntarios, atendimento social e orientacao para servicos locais.",
    location: "Centro Comunitario Promorar",
    startsAt: new Date("2026-04-26T13:00:00.000Z"),
    imageUrl: null,
    createdAt: new Date("2026-04-20T10:00:00.000Z"),
  },
  {
    id: "fallback-event-3",
    title: "Encontro de jovens com esporte e conversa",
    description:
      "Momento de integracao, escuta e fortalecimento do envolvimento dos jovens com a vida da comunidade.",
    location: "Quadra do bairro",
    startsAt: new Date("2026-04-27T22:00:00.000Z"),
    imageUrl: null,
    createdAt: new Date("2026-04-20T10:00:00.000Z"),
  },
];

const fallbackReports = [
  {
    id: "fallback-report-1",
    title: "Poste apagado perto da escola municipal",
    description:
      "Moradores relatam inseguranca no fim da tarde porque o trecho fica muito escuro no horario de saida das criancas.",
    category: "LIGHTING",
    severity: "HIGH",
    status: "IN_REVIEW",
    priority: "HIGH",
    address: "Rua da Esperanca, perto da escola municipal",
    neighborhood: "Promorar",
    latitude: -3.122,
    longitude: -60.018,
    imageUrl: null,
    managerComment: "Demanda registrada e encaminhada para acompanhamento com liderancas locais.",
    createdAt: new Date("2026-04-20T18:30:00.000Z"),
    updatedAt: new Date("2026-04-21T12:00:00.000Z"),
    relevantUpdatedAt: new Date("2026-04-21T12:00:00.000Z"),
  },
  {
    id: "fallback-report-2",
    title: "Entulho acumulado em esquina movimentada",
    description:
      "O local tem acumulado lixo e restos de obra, dificultando a passagem e gerando preocupacao entre moradores.",
    category: "CLEANING",
    severity: "MEDIUM",
    status: "OPEN",
    priority: "MEDIUM",
    address: "Esquina da Rua Sol Nascente com Travessa Nova Vida",
    neighborhood: "Nova Esperanca",
    latitude: null,
    longitude: null,
    imageUrl: null,
    managerComment: null,
    createdAt: new Date("2026-04-19T16:00:00.000Z"),
    updatedAt: new Date("2026-04-19T16:00:00.000Z"),
    relevantUpdatedAt: new Date("2026-04-19T16:00:00.000Z"),
  },
  {
    id: "fallback-report-3",
    title: "Calcada quebrada perto do posto de atendimento",
    description:
      "Idosos e pessoas com dificuldade de mobilidade encontram risco de queda no trecho de acesso ao atendimento comunitario.",
    category: "ACCESSIBILITY",
    severity: "HIGH",
    status: "IN_PROGRESS",
    priority: "HIGH",
    address: "Rua do Atendimento, 45",
    neighborhood: "Promorar",
    latitude: -3.1199,
    longitude: -60.0211,
    imageUrl: null,
    managerComment: "Equipe local levantou a necessidade e iniciou articulacao para ajuste emergencial.",
    createdAt: new Date("2026-04-18T15:00:00.000Z"),
    updatedAt: new Date("2026-04-20T10:30:00.000Z"),
    relevantUpdatedAt: new Date("2026-04-20T10:30:00.000Z"),
  },
] as const;

const fallbackReportStats = [
  { status: "OPEN", _count: { _all: 1 } },
  { status: "IN_REVIEW", _count: { _all: 1 } },
  { status: "IN_PROGRESS", _count: { _all: 1 } },
] as const;

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
      notices: portalFallbackNotices,
      events: portalFallbackEvents,
      reportStats: fallbackReportStats,
      recentReports: fallbackReports,
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
      notices: notices.length > 0 ? notices : portalFallbackNotices,
      events: events.length > 0 ? events : portalFallbackEvents,
      reportStats: reportStats.length > 0 ? reportStats : fallbackReportStats,
      recentReports: recentReports.length > 0 ? recentReports : fallbackReports,
    };
  } catch {
    return {
      notices: portalFallbackNotices,
      events: portalFallbackEvents,
      reportStats: fallbackReportStats,
      recentReports: fallbackReports,
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
      reports: fallbackReports,
      pagination: getPaginationMeta(fallbackReports.length, 1, publicReportsPageSize),
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
      reports: fallbackReports,
      pagination: getPaginationMeta(fallbackReports.length, 1, publicReportsPageSize),
    };
  }
}

export async function getPublicNotices() {
  if (!hasDatabaseUrl()) {
    return portalFallbackNotices;
  }

  try {
    const notices = await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    });

    return notices.length > 0 ? notices : portalFallbackNotices;
  } catch {
    return portalFallbackNotices;
  }
}

export async function getPublicEvents() {
  if (!hasDatabaseUrl()) {
    return portalFallbackEvents;
  }

  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { startsAt: "asc" },
      take: 10,
    });

    return events.length > 0 ? events : portalFallbackEvents;
  } catch {
    return portalFallbackEvents;
  }
}
