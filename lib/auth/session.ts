import { SignJWT, jwtVerify } from "jose";

import { authConfig } from "@/lib/auth/config";
import { getRequiredEnv } from "@/lib/env";

export type SessionPayload = {
  userId: string;
  email: string;
  role: "VIEWER" | "VOLUNTEER" | "EDITOR" | "MANAGER" | "ADMIN";
};

function getSessionSecret() {
  return new TextEncoder().encode(getRequiredEnv("AUTH_SECRET"));
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${authConfig.sessionMaxAgeInSeconds}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSessionSecret());

  return payload as SessionPayload;
}
