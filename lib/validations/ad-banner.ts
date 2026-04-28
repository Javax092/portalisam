import { z } from "zod";

import { adBannerPositions } from "@/lib/ad-banners";

const optionalUrl = z.string().trim().url("Informe uma URL valida.").optional().or(z.literal(""));

export const adBannerSchema = z.object({
  title: z.string().trim().min(2, "Informe o titulo do anuncio."),
  description: z
    .string()
    .trim()
    .max(240, "Use no maximo 240 caracteres na descricao.")
    .optional()
    .or(z.literal("")),
  imageUrl: z.string().trim().url("Informe uma URL valida para a imagem."),
  link: optionalUrl,
  isActive: z.boolean().default(true),
  priority: z.coerce.number().int().min(0, "A prioridade nao pode ser negativa.").default(0),
  position: z.enum(adBannerPositions, {
    message: "Selecione uma posicao valida para o anuncio.",
  }),
});

export type AdBannerInput = z.infer<typeof adBannerSchema>;
