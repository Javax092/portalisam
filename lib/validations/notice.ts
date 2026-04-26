import { z } from "zod";

export const noticeSchema = z.object({
  title: z.string().trim().min(3, "Informe um titulo com pelo menos 3 caracteres."),
  description: z.string().trim().min(10, "Descreva o aviso com mais detalhes."),
  category: z.string().trim().min(2, "Informe a categoria do aviso."),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
});

export type NoticeInput = z.infer<typeof noticeSchema>;
