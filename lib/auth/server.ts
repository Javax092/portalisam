import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { authConfig } from "@/lib/auth/config";
import { canAccessBackoffice, hasMinimumRole } from "@/lib/auth/roles";
import { getSessionCookieOptions } from "@/lib/auth/cookies";
import { createSessionToken, verifySessionToken, type SessionPayload } from "@/lib/auth/session";
import { hasDatabaseUrl, prisma } from "@/lib/db/prisma";

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.sessionCookie)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function createUserSession(session: SessionPayload) {
  const cookieStore = await cookies();
  const token = await createSessionToken(session);

  cookieStore.set(authConfig.sessionCookie, token, getSessionCookieOptions());
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(authConfig.sessionCookie);
}

export async function getCurrentUser() {
  const session = await getSessionFromCookies();

  if (!session || !hasDatabaseUrl()) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user?.isActive) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireBackofficeSession(minimumRole: UserRole = UserRole.ADMIN) {
  const session = await getSessionFromCookies();

  if (!session || !hasDatabaseUrl()) {
    redirect(`${authConfig.loginPath}?redirectTo=${encodeURIComponent(authConfig.loginRedirect)}`);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive || !canAccessBackoffice(user.role) || !hasMinimumRole(user.role, minimumRole)) {
      redirect(`${authConfig.loginPath}?redirectTo=${encodeURIComponent(authConfig.loginRedirect)}`);
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  } catch {
    redirect(`${authConfig.loginPath}?redirectTo=${encodeURIComponent(authConfig.loginRedirect)}`);
  }
}

export async function requireAdminSession() {
  return requireBackofficeSession(UserRole.ADMIN);
}
