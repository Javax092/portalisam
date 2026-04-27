import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { eventSchema } from "@/lib/validations/event";

export async function GET() {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const events = await prisma.event.findMany({ orderBy: [{ startsAt: "asc" }, { updatedAt: "desc" }] });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      startsAt: parsed.data.startsAt,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive,
      organizationId: session.organizationId ?? null,
      communityId: session.communityId ?? null,
    },
  });

  return NextResponse.json({ message: "Evento criado com sucesso.", event });
}
