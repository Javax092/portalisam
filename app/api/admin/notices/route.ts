import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { noticeSchema } from "@/lib/validations/notice";

export async function GET() {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const notices = await prisma.notice.findMany({
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ notices });
}

export async function POST(request: Request) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = noticeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const notice = await prisma.notice.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      isFeatured: parsed.data.isFeatured,
      isActive: parsed.data.isActive,
      organizationId: session.organizationId ?? null,
      communityId: session.communityId ?? null,
      publishedAt: parsed.data.publishedAt ?? null,
    },
  });

  return NextResponse.json({ message: "Aviso criado com sucesso.", notice });
}
