import { UserRole } from "@prisma/client";

import { prisma } from "../lib/db/prisma";
import { getAuthEnvStatus } from "../lib/env";

const expectedUsers = [
  { email: "admin@isam.org", role: UserRole.ADMIN },
  { email: "assistente@isam.org", role: UserRole.ASSISTANT },
] as const;

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

async function main() {
  const envStatus = getAuthEnvStatus();
  const failures: string[] = [];

  console.info("[auth:check] ENV", {
    databaseUrlExists: envStatus.databaseUrlExists,
    jwtSecretExists: envStatus.jwtSecretExists,
    jwtSecretLength: envStatus.jwtSecretLength,
    nodeEnv: envStatus.nodeEnv || "undefined",
    nodeEnvValid: envStatus.nodeEnvValid,
  });

  if (!envStatus.databaseUrlExists) {
    failures.push("DATABASE_URL ausente.");
  }

  if (!envStatus.jwtSecretExists) {
    failures.push("JWT_SECRET ausente.");
  }

  if (envStatus.jwtSecretLength > 0 && envStatus.jwtSecretLength < 32) {
    failures.push("JWT_SECRET com menos de 32 caracteres.");
  }

  if (!envStatus.nodeEnvValid) {
    failures.push("NODE_ENV invalido.");
  }

  await prisma.$connect();
  console.info("[auth:check] DB_CONNECTION", { ok: true });

  for (const expectedUser of expectedUsers) {
    const user = await prisma.user.findUnique({
      where: { email: expectedUser.email },
      select: {
        email: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    console.info("[auth:check] USER", {
      email: maskEmail(expectedUser.email),
      exists: Boolean(user),
      roleMatches: user?.role === expectedUser.role,
      isActive: user?.isActive ?? false,
      hasPasswordHash: Boolean(user?.passwordHash),
      passwordHashLength: user?.passwordHash.length ?? 0,
    });

    if (!user) {
      failures.push(`Usuario ${expectedUser.email} nao encontrado.`);
      continue;
    }

    if (user.role !== expectedUser.role) {
      failures.push(`Usuario ${expectedUser.email} com role incorreta.`);
    }

    if (!user.isActive) {
      failures.push(`Usuario ${expectedUser.email} inativo.`);
    }

    if (!user.passwordHash) {
      failures.push(`Usuario ${expectedUser.email} sem passwordHash.`);
    }
  }

  if (failures.length > 0) {
    console.error("[auth:check] FAILURES", failures);
    process.exitCode = 1;
    return;
  }

  console.info("[auth:check] OK", { usersChecked: expectedUsers.length });
}

main()
  .catch((error) => {
    console.error("[auth:check] FAILED", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Erro desconhecido.",
    });
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
