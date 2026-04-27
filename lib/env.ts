const VALID_NODE_ENVS = new Set(["development", "production", "test"]);

type RequiredEnvName = "DATABASE_URL" | "JWT_SECRET";

export type AuthEnvStatus = {
  databaseUrlExists: boolean;
  jwtSecretExists: boolean;
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
  const nodeEnv = process.env.NODE_ENV?.trim() ?? "";

  return {
    databaseUrlExists: databaseUrl.length > 0,
    jwtSecretExists: jwtSecret.length > 0,
    jwtSecretLength: jwtSecret.length,
    nodeEnv,
    nodeEnvValid: VALID_NODE_ENVS.has(nodeEnv),
  };
}

export function validateAuthEnv() {
  const status = getAuthEnvStatus();

  if (!status.databaseUrlExists) {
    throw new AuthConfigurationError("A variavel de ambiente DATABASE_URL nao foi configurada.");
  }

  if (!status.jwtSecretExists) {
    throw new AuthConfigurationError("A variavel de ambiente JWT_SECRET nao foi configurada.");
  }

  if (status.jwtSecretLength < 32) {
    throw new AuthConfigurationError("A variavel de ambiente JWT_SECRET deve ter pelo menos 32 caracteres.");
  }

  if (!status.nodeEnvValid) {
    throw new AuthConfigurationError("A variavel de ambiente NODE_ENV esta invalida.");
  }

  return status;
}

export function getJwtSecret() {
  validateAuthEnv();
  return getRequiredEnv("JWT_SECRET");
}

export function isAuthConfigurationError(error: unknown) {
  return error instanceof AuthConfigurationError;
}
