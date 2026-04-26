import { UserRole } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";

import { authConfig } from "@/lib/auth/config";
import { getJwtSecret } from "@/lib/env";

export type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

function getSessionSecret() {
  return new TextEncoder().encode(getJwtSecret());
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
