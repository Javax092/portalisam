import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { buildSponsorSlug } from "@/lib/sponsors";
import { sponsorSchema } from "@/lib/validations/sponsor";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const sponsor = await prisma.sponsor.findUnique({
    where: { id },
    include: {
      _count: {
        select: { advertisements: true },
      },
    },
  });

  if (!sponsor) {
    return NextResponse.json({ message: "Patrocinador nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ sponsor });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = sponsorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const { id } = await params;
  const sponsor = await prisma.sponsor.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: await buildSponsorSlug(parsed.data.name, id),
      description: parsed.data.description || null,
      logoUrl: parsed.data.logoUrl || null,
      websiteUrl: parsed.data.websiteUrl || null,
      whatsappUrl: parsed.data.whatsappUrl || null,
      category: parsed.data.category,
      isActive: parsed.data.isActive,
    },
    include: {
      _count: {
        select: { advertisements: true },
      },
    },
  });

  return NextResponse.json({ message: "Patrocinador atualizado com sucesso.", sponsor });
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const campaignCount = await prisma.advertisement.count({ where: { sponsorId: id } });

  if (campaignCount > 0) {
    return NextResponse.json(
      { message: "Nao e possivel excluir o patrocinador com campanhas vinculadas." },
      { status: 409 },
    );
  }

  await prisma.sponsor.delete({ where: { id } });
  return NextResponse.json({ message: "Patrocinador excluido com sucesso." });
}
