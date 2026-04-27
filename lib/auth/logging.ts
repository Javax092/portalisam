import { getAuthEnvStatus } from "@/lib/env";

type AuthLogEvent =
  | "LOGIN_ROUTE_HIT"
  | "ENV_CHECK"
  | "USER_FOUND"
  | "PASSWORD_VALID"
  | "COOKIE_SET";

type AuthLogMeta = Record<string, string | number | boolean | null | undefined>;

function shouldLogAuthDiagnostics() {
  return process.env.NODE_ENV !== "test";
}

export function logAuthDiagnostic(event: AuthLogEvent, meta: AuthLogMeta = {}) {
  if (!shouldLogAuthDiagnostics()) {
    return;
  }

  console.info("[auth]", event, meta);
}

export function getSafeEnvCheckLog() {
  const status = getAuthEnvStatus();

  return {
    databaseUrlExists: status.databaseUrlExists,
    jwtSecretExists: status.jwtSecretExists,
    jwtSecretLength: status.jwtSecretLength,
    nodeEnv: status.nodeEnv || "undefined",
    nodeEnvValid: status.nodeEnvValid,
  };
}
