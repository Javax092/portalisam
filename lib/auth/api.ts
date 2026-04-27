import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { canAccessBackoffice, hasMinimumRole } from "@/lib/auth/roles";
import { getSessionFromCookies } from "@/lib/auth/server";
import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";

export async function requireAdminApiSession(minimumRole: UserRole = UserRole.ASSISTANT) {
  const session = await getSessionFromCookies();

  if (!session || !hasDatabaseUrl()) {
    return NextResponse.json({ message: "Acesso administrativo nao autorizado." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        organizationId: true,
        communityId: true,
      },
    });

    if (!user || !user.isActive || !canAccessBackoffice(user.role) || !hasMinimumRole(user.role, minimumRole)) {
      return NextResponse.json({ message: "Acesso administrativo nao autorizado." }, { status: 401 });
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      communityId: user.communityId,
    };
  } catch {
    return NextResponse.json({ message: "Acesso administrativo nao autorizado." }, { status: 401 });
  }
}
