import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const DATABASE_URL_ENV_NAME = "DATABASE_URL";
const DIRECT_URL_ENV_NAME = "DIRECT_URL";

type DatabaseUrlInspection = {
  envName: "DATABASE_URL" | "DIRECT_URL";
  exists: boolean;
  hostname: string | null;
  isPooled: boolean;
  hasSslMode: boolean;
  hasPgBouncer: boolean;
  safeUrl: string | null;
};

export function hasDatabaseUrl() {
  return Boolean(process.env[DATABASE_URL_ENV_NAME]?.trim());
}

export function hasDirectUrl() {
  return Boolean(process.env[DIRECT_URL_ENV_NAME]?.trim());
}

export function isMissingDatabaseUrlError(error: unknown) {
  return (
    error instanceof Error &&
    error.name === "PrismaClientInitializationError" &&
    error.message.includes(`Environment variable not found: ${DATABASE_URL_ENV_NAME}`)
  );
}

export function isDatabaseConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error.name === "PrismaClientInitializationError") {
    return true;
  }

  const message = error.message.toLowerCase();

  return [
    "can't reach database server",
    "connection error",
    "connection terminated unexpectedly",
    "server closed the connection unexpectedly",
    "timed out",
    "timeout",
    "ssl",
    "pgbouncer",
  ].some((fragment) => message.includes(fragment));
}

export function sanitizeDatabaseUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.password) {
      url.password = "****";
    }
    return url.toString();
  } catch {
    return value.replace(/(postgres(?:ql)?:\/\/[^:]+:)([^@]+)@/i, "$1****@");
  }
}

export function inspectDatabaseUrl(
  envName: typeof DATABASE_URL_ENV_NAME | typeof DIRECT_URL_ENV_NAME,
): DatabaseUrlInspection {
  const rawValue = process.env[envName]?.trim();

  if (!rawValue) {
    return {
      envName,
      exists: false,
      hostname: null,
      isPooled: false,
      hasSslMode: false,
      hasPgBouncer: false,
      safeUrl: null,
    };
  }

  try {
    const url = new URL(rawValue);

    return {
      envName,
      exists: true,
      hostname: url.hostname,
      isPooled: url.hostname.includes("-pooler."),
      hasSslMode: url.searchParams.get("sslmode") === "require",
      hasPgBouncer: url.searchParams.get("pgbouncer") === "true",
      safeUrl: sanitizeDatabaseUrl(rawValue),
    };
  } catch {
    return {
      envName,
      exists: true,
      hostname: null,
      isPooled: rawValue.includes("-pooler."),
      hasSslMode: /(?:\?|&)sslmode=require(?:&|$)/i.test(rawValue),
      hasPgBouncer: /(?:\?|&)pgbouncer=true(?:&|$)/i.test(rawValue),
      safeUrl: sanitizeDatabaseUrl(rawValue),
    };
  }
}

export function getDatabaseConfigWarnings() {
  const databaseUrl = inspectDatabaseUrl(DATABASE_URL_ENV_NAME);
  const directUrl = inspectDatabaseUrl(DIRECT_URL_ENV_NAME);
  const warnings: string[] = [];

  if (!databaseUrl.exists) {
    warnings.push("DATABASE_URL ausente.");
  }

  if (!directUrl.exists) {
    warnings.push("DIRECT_URL ausente.");
  }

  if (databaseUrl.exists && !databaseUrl.hasSslMode) {
    warnings.push("DATABASE_URL sem sslmode=require.");
  }

  if (directUrl.exists && !directUrl.hasSslMode) {
    warnings.push("DIRECT_URL sem sslmode=require.");
  }

  if (databaseUrl.isPooled && !databaseUrl.hasPgBouncer) {
    warnings.push("DATABASE_URL pooled sem pgbouncer=true.");
  }

  if (directUrl.isPooled) {
    warnings.push("DIRECT_URL aponta para host pooled; use a conexao direta do Neon.");
  }

  return {
    databaseUrl,
    directUrl,
    warnings,
  };
}

export function logDatabaseError(scope: string, error: unknown, meta: Record<string, unknown> = {}) {
  const databaseConfig = getDatabaseConfigWarnings();

  console.error("[db]", scope, {
    ...meta,
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Erro desconhecido.",
    databaseUrl: databaseConfig.databaseUrl.safeUrl,
    directUrl: databaseConfig.directUrl.safeUrl,
    warnings: databaseConfig.warnings,
  });
}

export function getDatabaseUrlMessage() {
  return "DATABASE_URL nao foi configurada. Copie .env.example para .env e ajuste a conexao com o PostgreSQL local.";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
