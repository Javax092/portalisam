import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { buildAdSlotSlug } from "@/lib/sponsors";
import { adSlotSchema } from "@/lib/validations/sponsor";

export async function GET() {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const slots = await prisma.adSlot.findMany({
    include: {
      _count: {
        select: { advertisements: true },
      },
    },
    orderBy: [{ placement: "asc" }, { title: "asc" }],
  });

  return NextResponse.json({ slots });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = adSlotSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const slot = await prisma.adSlot.create({
    data: {
      title: parsed.data.title,
      slug: await buildAdSlotSlug(parsed.data.title),
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

  return NextResponse.json({ message: "Espaco criado com sucesso.", slot });
}
