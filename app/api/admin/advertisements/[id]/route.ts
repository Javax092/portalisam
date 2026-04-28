import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { advertisementSchema } from "@/lib/validations/sponsor";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const advertisement = await prisma.advertisement.findUnique({
    where: { id },
    include: {
      sponsor: true,
      adSlot: true,
    },
  });

  if (!advertisement) {
    return NextResponse.json({ message: "Campanha nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({ advertisement });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = advertisementSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const { id } = await params;
  const advertisement = await prisma.advertisement.update({
    where: { id },
    data: {
      sponsorId: parsed.data.sponsorId,
      adSlotId: parsed.data.adSlotId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl,
      targetUrl: parsed.data.targetUrl || null,
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt ?? null,
      priority: parsed.data.priority,
      isActive: parsed.data.isActive,
    },
    include: {
      sponsor: true,
      adSlot: true,
    },
  });

  return NextResponse.json({ message: "Campanha atualizada com sucesso.", advertisement });
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  await prisma.advertisement.delete({ where: { id } });
  return NextResponse.json({ message: "Campanha excluida com sucesso." });
}
