import { Prisma, ReportActivityType, ReportPriority, ReportStatus } from "@prisma/client";

export const adminReportsPageSize = 12;
export const publicReportsPageSize = 12;

export type ReportListFilters = {
  query?: string;
  status?: string;
  priority?: string;
  category?: string;
  neighborhood?: string;
  assignedToUserId?: string;
  page?: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ReportSlaWindow = {
  firstResponseDueAt: Date | null;
  resolutionDueAt: Date | null;
};

export function normalizeListQuery(value?: string | null) {
  if (!value) return undefined;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function normalizePage(value?: string | number | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export function getPaginationMeta(totalItems: number, page: number, pageSize: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
}

export function buildPublicReportWhere(filters?: ReportListFilters): Prisma.ReportWhereInput {
  const query = normalizeListQuery(filters?.query);
  const neighborhood = normalizeListQuery(filters?.neighborhood);

  return {
    category: filters?.category ? (filters.category as never) : undefined,
    status: filters?.status ? (filters.status as never) : undefined,
    priority: filters?.priority ? (filters.priority as never) : undefined,
    neighborhood: neighborhood
      ? {
          contains: neighborhood,
          mode: "insensitive",
        }
      : undefined,
    OR: query
      ? [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
          { neighborhood: { contains: query, mode: "insensitive" } },
          { managerComment: { contains: query, mode: "insensitive" } },
        ]
      : undefined,
  };
}

export function buildAdminReportWhere(filters?: ReportListFilters): Prisma.ReportWhereInput {
  const query = normalizeListQuery(filters?.query);

  return {
    category: filters?.category ? (filters.category as never) : undefined,
    status: filters?.status ? (filters.status as never) : undefined,
    priority: filters?.priority ? (filters.priority as never) : undefined,
    assignedToUserId: filters?.assignedToUserId || undefined,
    OR: query
      ? [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
          { neighborhood: { contains: query, mode: "insensitive" } },
          { managerComment: { contains: query, mode: "insensitive" } },
          { assignedTo: { is: { name: { contains: query, mode: "insensitive" } } } },
          { assignedTo: { is: { email: { contains: query, mode: "insensitive" } } } },
        ]
      : undefined,
  };
}

export function getReportSlaWindow(status: ReportStatus, priority: ReportPriority, createdAt: Date): ReportSlaWindow {
  const firstResponseHours = priority === ReportPriority.URGENT ? 4 : priority === ReportPriority.HIGH ? 12 : 24;
  const resolutionDays = priority === ReportPriority.URGENT ? 2 : priority === ReportPriority.HIGH ? 5 : priority === ReportPriority.MEDIUM ? 10 : 15;

  if (status === ReportStatus.RESOLVED || status === ReportStatus.ARCHIVED) {
    return {
      firstResponseDueAt: null,
      resolutionDueAt: null,
    };
  }

  return {
    firstResponseDueAt: new Date(createdAt.getTime() + firstResponseHours * 60 * 60 * 1000),
    resolutionDueAt: new Date(createdAt.getTime() + resolutionDays * 24 * 60 * 60 * 1000),
  };
}

export function getReportActivityLabel(type: ReportActivityType) {
  switch (type) {
    case ReportActivityType.CREATED:
      return "Ocorrencia criada";
    case ReportActivityType.STATUS_CHANGED:
      return "Status alterado";
    case ReportActivityType.PRIORITY_CHANGED:
      return "Prioridade alterada";
    case ReportActivityType.ASSIGNED:
      return "Responsavel definido";
    case ReportActivityType.UNASSIGNED:
      return "Responsavel removido";
    case ReportActivityType.COMMENT_ADDED:
      return "Comentario publico";
    case ReportActivityType.INTERNAL_NOTE_ADDED:
      return "Nota interna";
    case ReportActivityType.PUBLIC_UPDATE_EDITED:
      return "Atualizacao publica editada";
    case ReportActivityType.NOTIFICATION_QUEUED:
      return "Notificacao preparada";
    case ReportActivityType.NOTIFICATION_SENT:
      return "Notificacao enviada";
  }
}
