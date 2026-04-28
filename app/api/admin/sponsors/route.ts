import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { buildSponsorSlug } from "@/lib/sponsors";
import { sponsorSchema } from "@/lib/validations/sponsor";

export async function GET() {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const sponsors = await prisma.sponsor.findMany({
    include: {
      _count: {
        select: { advertisements: true },
      },
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return NextResponse.json({ sponsors });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = sponsorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      name: parsed.data.name,
      slug: await buildSponsorSlug(parsed.data.name),
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

  return NextResponse.json({ message: "Patrocinador criado com sucesso.", sponsor });
}
