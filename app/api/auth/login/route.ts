import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth/config";
import { logAuthDiagnostic, getSafeEnvCheckLog } from "@/lib/auth/logging";
import { canAccessBackoffice } from "@/lib/auth/roles";
import { createUserSession } from "@/lib/auth/server";
import { verifyPassword } from "@/lib/auth/password";
import { getDatabaseUrlMessage, hasDatabaseUrl, isMissingDatabaseUrlError, prisma } from "@/lib/db/prisma";
import { isAuthConfigurationError, validateAuthEnv } from "@/lib/env";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  logAuthDiagnostic("LOGIN_ROUTE_HIT", {
    method: request.method,
    nodeEnv: process.env.NODE_ENV ?? "undefined",
  });

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados de login invalidos." },
      { status: 400 },
    );
  }

  const envCheck = getSafeEnvCheckLog();
  logAuthDiagnostic("ENV_CHECK", envCheck);

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? getDatabaseUrlMessage()
            : "Servidor de autenticacao indisponivel.",
      },
      { status: 500 },
    );
  }

  try {
    validateAuthEnv();

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

    logAuthDiagnostic("USER_FOUND", {
      email: normalizedEmail,
      found: Boolean(user),
      isActive: user?.isActive ?? null,
      role: user?.role ?? null,
    });

    if (!user) {
      return NextResponse.json({ message: "Credenciais invalidas." }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Usuario inativo." },
        { status: 403 },
      );
    }

    const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash);

    logAuthDiagnostic("PASSWORD_VALID", {
      email: normalizedEmail,
      valid: isValidPassword,
    });

    if (!isValidPassword) {
      return NextResponse.json({ message: "Credenciais invalidas." }, { status: 401 });
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

    logAuthDiagnostic("COOKIE_SET", {
      email: normalizedEmail,
      cookieName: authConfig.sessionCookie,
      maxAge: authConfig.sessionMaxAgeInSeconds,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          isAuthConfigurationError(error)
            ? "Configuracao de autenticacao ausente no servidor."
            : process.env.NODE_ENV === "development" && isMissingDatabaseUrlError(error)
            ? getDatabaseUrlMessage()
            : "Servidor de autenticacao indisponivel.",
      },
      { status: 500 },
    );
  }
}
