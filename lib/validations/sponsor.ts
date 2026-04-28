import { AdPlacement } from "@prisma/client";
import { z } from "zod";

const optionalUrl = z.string().url("Informe uma URL valida.").optional().or(z.literal(""));

export const sponsorSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do patrocinador."),
  description: z.string().trim().min(10, "Descreva o patrocinador com mais detalhes.").optional().or(z.literal("")),
  category: z.string().trim().min(2, "Informe a categoria do patrocinador."),
  logoUrl: optionalUrl,
  websiteUrl: optionalUrl,
  whatsappUrl: optionalUrl,
  isActive: z.boolean().default(true),
});

export const adSlotSchema = z.object({
  title: z.string().trim().min(2, "Informe o titulo do espaco."),
  description: z.string().trim().min(10, "Descreva o espaco com mais detalhes.").optional().or(z.literal("")),
  placement: z.nativeEnum(AdPlacement),
  size: z.string().trim().min(2, "Informe o tamanho do espaco."),
  isActive: z.boolean().default(true),
});

export const advertisementSchema = z
  .object({
    sponsorId: z.string().trim().min(1, "Selecione um patrocinador."),
    adSlotId: z.string().trim().min(1, "Selecione um espaco de anuncio."),
    title: z.string().trim().min(2, "Informe o titulo da campanha."),
    description: z.string().trim().min(10, "Descreva a campanha com mais detalhes.").optional().or(z.literal("")),
    imageUrl: z.string().trim().url("Informe uma URL valida para a imagem do banner."),
    targetUrl: optionalUrl,
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
    priority: z.coerce.number().int().min(0, "A prioridade nao pode ser negativa.").default(0),
    isActive: z.boolean().default(true),
  })
  .refine((data) => !data.endsAt || data.endsAt > data.startsAt, {
    message: "A data final deve ser maior que a data inicial.",
    path: ["endsAt"],
  });

export type SponsorInput = z.infer<typeof sponsorSchema>;
export type AdSlotInput = z.infer<typeof adSlotSchema>;
export type AdvertisementInput = z.infer<typeof advertisementSchema>;
