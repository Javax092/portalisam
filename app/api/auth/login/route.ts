import { NextResponse } from "next/server";

import { canAccessBackoffice } from "@/lib/auth/roles";
import { createUserSession } from "@/lib/auth/server";
import { verifyPassword } from "@/lib/auth/password";
import { getDatabaseUrlMessage, hasDatabaseUrl, isMissingDatabaseUrlError, prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados de login invalidos." },
      { status: 400 },
    );
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? getDatabaseUrlMessage()
            : "A configuracao do banco de dados nao esta disponivel no momento.",
      },
      { status: 500 },
    );
  }

  try {
    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "E-mail ou senha invalidos." }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Seu acesso esta desativado. Fale com a administracao do portal." },
        { status: 403 },
      );
    }

    const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ message: "E-mail ou senha invalidos." }, { status: 401 });
    }

    if (!canAccessBackoffice(user.role)) {
      return NextResponse.json(
        { message: "Acesso nao autorizado. Apenas administradores ativos podem entrar no painel." },
        { status: 403 },
      );
    }

    await createUserSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development" && isMissingDatabaseUrlError(error)
            ? getDatabaseUrlMessage()
            : "Nao foi possivel iniciar o login por causa da configuracao do servidor.",
      },
      { status: 500 },
    );
  }
}
