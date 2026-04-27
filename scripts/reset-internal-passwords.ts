import { prisma } from "../lib/db/prisma";
import { hashPassword } from "../lib/auth/password";
import { getDatabaseUrlMessage, hasDatabaseUrl } from "../lib/db/prisma";

const internalUsers = [
  {
    email: "admin@isam.org",
    envName: "ADMIN_DEFAULT_PASSWORD",
  },
  {
    email: "assistente@isam.org",
    envName: "ASSISTANT_DEFAULT_PASSWORD",
  },
] as const;

function getRequiredPassword(envName: (typeof internalUsers)[number]["envName"]) {
  const value = process.env[envName]?.trim();

  if (!value) {
    throw new Error(`A variavel ${envName} e obrigatoria para resetar as senhas internas.`);
  }

  return value;
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

async function main() {
  if (!hasDatabaseUrl()) {
    throw new Error(getDatabaseUrlMessage());
  }

  const passwordHashes = await Promise.all(
    internalUsers.map(async ({ envName }) => ({
      envName,
      passwordHash: await hashPassword(getRequiredPassword(envName)),
    })),
  );

  await prisma.$transaction(async (tx) => {
    const existingUsers = await tx.user.findMany({
      where: {
        email: {
          in: internalUsers.map((user) => user.email),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (existingUsers.length !== internalUsers.length) {
      const existingEmails = new Set(existingUsers.map((user) => user.email));
      const missingEmails = internalUsers
        .filter((user) => !existingEmails.has(user.email))
        .map((user) => user.email);

      throw new Error(`Usuarios internos nao encontrados: ${missingEmails.join(", ")}`);
    }

    for (const user of internalUsers) {
      const passwordHash = passwordHashes.find((item) => item.envName === user.envName)?.passwordHash;

      if (!passwordHash) {
        throw new Error(`Hash de senha ausente para ${user.envName}.`);
      }

      await tx.user.update({
        where: { email: user.email },
        data: {
          passwordHash,
          isActive: true,
        },
      });

      console.info("[auth:reset] USER_UPDATED", {
        email: maskEmail(user.email),
        isActive: true,
        passwordHashUpdated: true,
      });
    }
  });

  console.info("[auth:reset] OK", {
    usersUpdated: internalUsers.length,
  });
}

main()
  .catch((error) => {
    console.error("[auth:reset] FAILED", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Erro desconhecido.",
    });
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
