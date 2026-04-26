import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const DATABASE_URL_ENV_NAME = "DATABASE_URL";

export function hasDatabaseUrl() {
  return Boolean(process.env[DATABASE_URL_ENV_NAME]?.trim());
}

export function isMissingDatabaseUrlError(error: unknown) {
  return (
    error instanceof Error &&
    error.name === "PrismaClientInitializationError" &&
    error.message.includes(`Environment variable not found: ${DATABASE_URL_ENV_NAME}`)
  );
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
