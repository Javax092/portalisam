import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { adBannerSchema } from "@/lib/validations/ad-banner";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;
    const banner = await prisma.adBanner.findUnique({ where: { id } });

    if (!banner) {
      return NextResponse.json({ message: "Anuncio nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ banner });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error, "Nao foi possivel carregar o anuncio.") },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteProps) {
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

    const { id } = await params;
    const banner = await prisma.adBanner.update({
      where: { id },
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

    return NextResponse.json({ message: "Anuncio atualizado com sucesso.", banner });
  } catch (error) {
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025" ? 404 : 500;

    return NextResponse.json(
      { message: getErrorMessage(error, status === 404 ? "Anuncio nao encontrado." : "Nao foi possivel atualizar o anuncio.") },
      { status },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.ADMIN);
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;
    await prisma.adBanner.delete({ where: { id } });
    return NextResponse.json({ message: "Anuncio removido com sucesso." });
  } catch (error) {
    const status =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025" ? 404 : 500;

    return NextResponse.json(
      { message: getErrorMessage(error, status === 404 ? "Anuncio nao encontrado." : "Nao foi possivel remover o anuncio.") },
      { status },
    );
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
