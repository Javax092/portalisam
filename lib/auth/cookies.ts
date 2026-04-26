import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { authConfig } from "@/lib/auth/config";

export function getSessionCookieOptions(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: authConfig.sessionMaxAgeInSeconds,
  };
}
