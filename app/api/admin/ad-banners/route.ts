import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { adBannerSchema } from "@/lib/validations/ad-banner";

export async function GET() {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  try {
    const banners = await prisma.adBanner.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error, "Nao foi possivel listar os anuncios.") },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json().catch(() => null);
    const parsed = adBannerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Dados invalidos para o anuncio." },
        { status: 400 },
      );
    }

    const banner = await prisma.adBanner.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        imageUrl: parsed.data.imageUrl,
        link: parsed.data.link || null,
        isActive: parsed.data.isActive,
        priority: parsed.data.priority,
        position: parsed.data.position,
      },
    });

    return NextResponse.json({ message: "Anuncio criado com sucesso.", banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error, "Nao foi possivel criar o anuncio.") },
      { status: 500 },
    );
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
