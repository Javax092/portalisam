import { z } from "zod";

export const adminReportFiltersSchema = z.object({
  query: z.string().trim().max(120).optional().or(z.literal("")),
  status: z.string().trim().optional().or(z.literal("")),
  priority: z.string().trim().optional().or(z.literal("")),
  category: z.string().trim().optional().or(z.literal("")),
  assignedToUserId: z.string().trim().optional().or(z.literal("")),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export const publicReportFiltersSchema = z.object({
  query: z.string().trim().max(120).optional().or(z.literal("")),
  category: z.string().trim().optional().or(z.literal("")),
  status: z.string().trim().optional().or(z.literal("")),
  priority: z.string().trim().optional().or(z.literal("")),
  neighborhood: z.string().trim().max(120).optional().or(z.literal("")),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export type AdminReportFiltersInput = z.infer<typeof adminReportFiltersSchema>;
export type PublicReportFiltersInput = z.infer<typeof publicReportFiltersSchema>;
