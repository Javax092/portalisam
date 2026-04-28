const VALID_NODE_ENVS = new Set(["development", "production", "test"]);

type RequiredEnvName = "DATABASE_URL" | "JWT_SECRET" | "AUTH_SECRET";

export type AuthEnvStatus = {
  databaseUrlExists: boolean;
  jwtSecretExists: boolean;
  authSecretExists: boolean;
  effectiveJwtSecretExists: boolean;
  effectiveJwtSecretSource: "JWT_SECRET" | "AUTH_SECRET" | null;
  adminDefaultPasswordExists: boolean;
  adminDefaultEmailExists: boolean;
  assistantDefaultPasswordExists: boolean;
  assistantDefaultEmailExists: boolean;
  jwtSecretLength: number;
  nodeEnv: string;
  nodeEnvValid: boolean;
};

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export function getRequiredEnv(name: RequiredEnvName) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new AuthConfigurationError(`A variavel de ambiente ${name} nao foi configurada.`);
  }

  return value;
}

export function getAuthEnvStatus(): AuthEnvStatus {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
  const jwtSecret = process.env.JWT_SECRET?.trim() ?? "";
  const authSecret = process.env.AUTH_SECRET?.trim() ?? "";
  const nodeEnv = process.env.NODE_ENV?.trim() ?? "";
  const effectiveJwtSecret = jwtSecret || authSecret;
  const effectiveJwtSecretSource = jwtSecret ? "JWT_SECRET" : authSecret ? "AUTH_SECRET" : null;

  return {
    databaseUrlExists: databaseUrl.length > 0,
    jwtSecretExists: jwtSecret.length > 0,
    authSecretExists: authSecret.length > 0,
    effectiveJwtSecretExists: effectiveJwtSecret.length > 0,
    effectiveJwtSecretSource,
    adminDefaultPasswordExists: Boolean(process.env.ADMIN_DEFAULT_PASSWORD?.trim()),
    adminDefaultEmailExists: Boolean(process.env.ADMIN_DEFAULT_EMAIL?.trim()),
    assistantDefaultPasswordExists: Boolean(process.env.ASSISTANT_DEFAULT_PASSWORD?.trim()),
    assistantDefaultEmailExists: Boolean(process.env.ASSISTANT_DEFAULT_EMAIL?.trim()),
    jwtSecretLength: effectiveJwtSecret.length,
    nodeEnv,
    nodeEnvValid: VALID_NODE_ENVS.has(nodeEnv),
  };
}

export function validateAuthEnv() {
  const status = getAuthEnvStatus();

  if (!status.databaseUrlExists) {
    throw new AuthConfigurationError("A variavel de ambiente DATABASE_URL nao foi configurada.");
  }

  if (!status.effectiveJwtSecretExists) {
    throw new AuthConfigurationError(
      "Uma variavel de ambiente de segredo da autenticacao nao foi configurada. Defina JWT_SECRET ou AUTH_SECRET.",
    );
  }

  if (status.jwtSecretLength < 32) {
    throw new AuthConfigurationError(
      `A variavel de ambiente ${status.effectiveJwtSecretSource ?? "JWT_SECRET"} deve ter pelo menos 32 caracteres.`,
    );
  }

  if (!status.nodeEnvValid) {
    throw new AuthConfigurationError("A variavel de ambiente NODE_ENV esta invalida.");
  }

  return status;
}

export function getJwtSecret() {
  validateAuthEnv();
  return process.env.JWT_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || getRequiredEnv("JWT_SECRET");
}

export function isAuthConfigurationError(error: unknown) {
  return error instanceof AuthConfigurationError;
}
