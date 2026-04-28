import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { advertisementSchema } from "@/lib/validations/sponsor";

export async function GET() {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const advertisements = await prisma.advertisement.findMany({
    include: {
      sponsor: true,
      adSlot: true,
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ advertisements });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = advertisementSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const advertisement = await prisma.advertisement.create({
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

  return NextResponse.json({ message: "Campanha criada com sucesso.", advertisement });
}
