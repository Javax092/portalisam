import { NextResponse } from "next/server";

import { authErrorResponse } from "@/lib/auth/http";
import { authConfig } from "@/lib/auth/config";
import { logAuthDiagnostic, getSafeEnvCheckLog } from "@/lib/auth/logging";
import { canAccessBackoffice } from "@/lib/auth/roles";
import { createUserSession } from "@/lib/auth/server";
import { verifyPassword } from "@/lib/auth/password";
import {
  getDatabaseUrlMessage,
  hasDatabaseUrl,
  isDatabaseConnectionError,
  isMissingDatabaseUrlError,
  logDatabaseError,
  prisma,
} from "@/lib/db/prisma";
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
    return authErrorResponse(
      parsed.error.issues[0]?.message ?? "Dados de login invalidos.",
      400,
      "AUTH_BAD_REQUEST",
    );
  }

  const envCheck = getSafeEnvCheckLog();
  logAuthDiagnostic("ENV_CHECK", envCheck);

  if (!hasDatabaseUrl()) {
    return authErrorResponse(
      process.env.NODE_ENV === "development"
        ? getDatabaseUrlMessage()
        : "Servidor de autenticacao indisponivel.",
      500,
      "AUTH_SERVER_UNAVAILABLE",
    );
  }

  try {
    validateAuthEnv();
    try {
      await prisma.$connect();
      logAuthDiagnostic("PRISMA_CONNECTION", { connected: true });
    } catch (error) {
      logDatabaseError("auth.login.connect", error);
      logAuthDiagnostic("PRISMA_CONNECTION", {
        connected: false,
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : "Erro desconhecido.",
      });
      throw error;
    }

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
      return authErrorResponse("Credenciais invalidas.", 401, "AUTH_UNAUTHORIZED");
    }

    if (!user.isActive) {
      return authErrorResponse("Usuario inativo.", 403, "AUTH_FORBIDDEN");
    }

    const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash);

    logAuthDiagnostic("PASSWORD_VALID", {
      email: normalizedEmail,
      valid: isValidPassword,
    });

    if (!isValidPassword) {
      return authErrorResponse("Credenciais invalidas.", 401, "AUTH_UNAUTHORIZED");
    }

    if (!canAccessBackoffice(user.role)) {
      return authErrorResponse(
        "Acesso nao autorizado. Apenas administradores ativos podem entrar no painel.",
        403,
        "AUTH_FORBIDDEN",
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
    if (isDatabaseConnectionError(error)) {
      logDatabaseError("auth.login.failure", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message: "Banco de dados indisponível no momento.",
          },
        },
        { status: 503 },
      );
    }

    logAuthDiagnostic("LOGIN_FAILURE", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Erro desconhecido.",
      prismaMissingDatabaseUrl: isMissingDatabaseUrlError(error),
    });

    if (isAuthConfigurationError(error)) {
      return authErrorResponse("Configuracao de autenticacao ausente no servidor.", 500, "AUTH_CONFIG_ERROR");
    }

    if (process.env.NODE_ENV === "development" && isMissingDatabaseUrlError(error)) {
      return authErrorResponse(getDatabaseUrlMessage(), 500, "AUTH_SERVER_UNAVAILABLE");
    }

    return authErrorResponse(
      "Servidor de autenticacao indisponivel.",
      500,
      "AUTH_SERVER_UNAVAILABLE",
    );
  }
}
