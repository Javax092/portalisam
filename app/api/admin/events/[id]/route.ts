import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { eventSchema } from "@/lib/validations/event";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return NextResponse.json({ message: "Evento nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const { id } = await params;
  const event = await prisma.event.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      startsAt: parsed.data.startsAt,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json({ message: "Evento atualizado com sucesso.", event });
}
