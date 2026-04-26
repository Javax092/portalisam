import { z } from "zod";

const reportCategoryValues = [
  "INFRASTRUCTURE",
  "LIGHTING",
  "CLEANING",
  "ACCESSIBILITY",
  "SECURITY",
  "OTHER",
] as const;

const reportSeverityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const reportStatusValues = ["OPEN", "IN_REVIEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"] as const;
const reportPriorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const reportSchema = z.object({
  title: z.string().min(3, "Informe um titulo com pelo menos 3 caracteres."),
  description: z.string().min(10, "Descreva a demanda com mais detalhes."),
  category: z.enum(reportCategoryValues),
  severity: z.enum(reportSeverityValues),
  status: z.enum(reportStatusValues),
  priority: z.enum(reportPriorityValues),
  address: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  managerComment: z.string().trim().optional(),
});

export const publicCreateReportSchema = z.object({
  title: z.string().trim().min(3, "Informe um titulo com pelo menos 3 caracteres."),
  description: z.string().trim().min(10, "Descreva melhor o problema para ajudar no acompanhamento."),
  category: z.enum(reportCategoryValues, {
    required_error: "Selecione uma categoria.",
    invalid_type_error: "Selecione uma categoria.",
  }),
  severity: z.enum(reportSeverityValues, {
    required_error: "Selecione a gravidade da demanda.",
    invalid_type_error: "Selecione a gravidade da demanda.",
  }),
  address: z.string().trim().max(180, "Use um endereco mais curto.").optional().or(z.literal("")),
  neighborhood: z.string().trim().max(120, "Use um nome de bairro mais curto.").optional().or(z.literal("")),
  submittedByName: z.string().trim().max(120, "Use um nome mais curto.").optional().or(z.literal("")),
  submittedByEmail: z.string().trim().email("Informe um e-mail valido.").optional().or(z.literal("")),
  submittedByPhone: z.string().trim().max(40, "Use um telefone mais curto.").optional().or(z.literal("")),
  allowEmailUpdates: z.boolean().optional().default(false),
  allowWhatsappUpdates: z.boolean().optional().default(false),
  latitude: z
    .union([z.number().min(-90).max(90), z.nan()])
    .optional()
    .transform((value) => (value === undefined || Number.isNaN(value) ? undefined : value)),
  longitude: z
    .union([z.number().min(-180).max(180), z.nan()])
    .optional()
    .transform((value) => (value === undefined || Number.isNaN(value) ? undefined : value)),
  imageUrl: z.string().trim().url("Informe uma URL valida para a foto.").optional().or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportSchema>;
export type PublicCreateReportInput = z.infer<typeof publicCreateReportSchema>;

export const adminReportUpdateSchema = z.object({
  status: z.enum(reportStatusValues, {
    required_error: "Selecione um status.",
    invalid_type_error: "Selecione um status.",
  }),
  priority: z.enum(reportPriorityValues, {
    required_error: "Selecione uma prioridade.",
    invalid_type_error: "Selecione uma prioridade.",
  }),
  assignedToUserId: z.string().trim().optional().or(z.literal("")),
  managerComment: z.string().trim().max(600, "Use um comentario mais curto.").optional().or(z.literal("")),
  internalComment: z.string().trim().max(600, "Use uma nota mais curta.").optional().or(z.literal("")),
});

export type AdminReportUpdateInput = z.infer<typeof adminReportUpdateSchema>;
