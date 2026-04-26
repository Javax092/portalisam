import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().trim().min(3, "Informe um titulo com pelo menos 3 caracteres."),
  description: z.string().trim().min(10, "Descreva o evento com mais detalhes."),
  location: z.string().trim().min(3, "Informe o local do evento."),
  startsAt: z.coerce.date(),
  imageUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type EventInput = z.infer<typeof eventSchema>;
