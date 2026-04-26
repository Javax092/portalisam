import { NextResponse, type NextRequest } from "next/server";

import { canAccessBackoffice } from "@/lib/auth/roles";
import { authConfig } from "@/lib/auth/config";
import { verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get(authConfig.sessionCookie)?.value;
  const isProtectedAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  let session = null;

  if (token) {
    try {
      session = await verifySessionToken(token);
    } catch {
      session = null;
    }
  }

  if (isProtectedAdminRoute && (!session || !canAccessBackoffice(session.role))) {
    const loginUrl = new URL(authConfig.loginPath, request.url);
    loginUrl.searchParams.set("redirectTo", `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
