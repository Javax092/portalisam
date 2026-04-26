import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { noticeSchema } from "@/lib/validations/notice";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice) {
    return NextResponse.json({ message: "Aviso nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ notice });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = noticeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const { id } = await params;

  const notice = await prisma.notice.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      isFeatured: parsed.data.isFeatured,
      isActive: parsed.data.isActive,
      publishedAt: parsed.data.publishedAt ?? null,
    },
  });

  return NextResponse.json({ message: "Aviso atualizado com sucesso.", notice });
}
