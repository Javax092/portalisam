import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { buildAdSlotSlug } from "@/lib/sponsors";
import { adSlotSchema } from "@/lib/validations/sponsor";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const slot = await prisma.adSlot.findUnique({
    where: { id },
    include: {
      _count: {
        select: { advertisements: true },
      },
    },
  });

  if (!slot) {
    return NextResponse.json({ message: "Espaco nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ slot });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = adSlotSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const { id } = await params;
  const slot = await prisma.adSlot.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: await buildAdSlotSlug(parsed.data.title, id),
      description: parsed.data.description || null,
      placement: parsed.data.placement,
      size: parsed.data.size,
      isActive: parsed.data.isActive,
    },
    include: {
      _count: {
        select: { advertisements: true },
      },
    },
  });

  return NextResponse.json({ message: "Espaco atualizado com sucesso.", slot });
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const campaignCount = await prisma.advertisement.count({ where: { adSlotId: id } });

  if (campaignCount > 0) {
    return NextResponse.json(
      { message: "Nao e possivel excluir o espaco com campanhas vinculadas." },
      { status: 409 },
    );
  }

  await prisma.adSlot.delete({ where: { id } });
  return NextResponse.json({ message: "Espaco excluido com sucesso." });
}
