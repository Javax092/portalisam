import type { ReportCategory, ReportPriority, ReportSeverity, ReportStatus, UserRole } from "@prisma/client";

export const reportCategoryLabels: Record<ReportCategory, string> = {
  INFRASTRUCTURE: "Infraestrutura",
  LIGHTING: "Iluminacao",
  CLEANING: "Limpeza",
  ACCESSIBILITY: "Acessibilidade",
  SECURITY: "Seguranca",
  OTHER: "Outro",
};

export const reportSeverityLabels: Record<ReportSeverity, string> = {
  LOW: "Baixa",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  OPEN: "Recebida",
  IN_REVIEW: "Em análise",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvida",
  ARCHIVED: "Arquivada",
};

export const reportPriorityLabels: Record<ReportPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export const userRoleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  ASSISTANT: "Assistente",
};

export const categoryOptions = Object.entries(reportCategoryLabels).map(([value, label]) => ({
  value,
  label,
}));

export const severityOptions = Object.entries(reportSeverityLabels).map(([value, label]) => ({
  value,
  label,
}));

export const statusOptions = Object.entries(reportStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

export const priorityOptions = Object.entries(reportPriorityLabels).map(([value, label]) => ({
  value,
  label,
}));

export function getReportStatusTone(status: ReportStatus) {
  const tones: Record<ReportStatus, "open" | "review" | "progress" | "resolved" | "archived"> = {
    OPEN: "open",
    IN_REVIEW: "review",
    IN_PROGRESS: "progress",
    RESOLVED: "resolved",
    ARCHIVED: "archived",
  };

  return tones[status];
}

export function getPriorityTone(priority: ReportPriority | ReportSeverity) {
  const tones: Record<ReportPriority | ReportSeverity, "low" | "medium" | "high" | "urgent"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent",
  };

  return tones[priority];
}

export function getPriorityFromSeverity(severity: ReportSeverity): ReportPriority {
  if (severity === "URGENT") return "URGENT";
  if (severity === "HIGH") return "HIGH";
  if (severity === "MEDIUM") return "MEDIUM";
  return "LOW";
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(parsedDate);
}
