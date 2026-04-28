import { PrismaClient } from "@prisma/client";

import { getDatabaseConfigWarnings, hasDatabaseUrl } from "../lib/db/prisma";

async function main() {
  const config = getDatabaseConfigWarnings();

  console.info("[db:check] CONFIG", {
    databaseUrl: config.databaseUrl.safeUrl,
    directUrl: config.directUrl.safeUrl,
    warnings: config.warnings,
  });

  if (!hasDatabaseUrl()) {
    console.error("[db:check] FAILED", {
      message: "DATABASE_URL nao foi configurada.",
    });
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  try {
    await prisma.$connect();
    console.info("[db:check] CONNECT", { ok: true });

    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 AS result`;
    console.info("[db:check] QUERY", {
      ok: result[0]?.result === 1,
      rows: result.length,
    });
  } catch (error) {
    console.error("[db:check] FAILED", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Erro desconhecido.",
      databaseUrl: config.databaseUrl.safeUrl,
      directUrl: config.directUrl.safeUrl,
      warnings: config.warnings,
    });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
