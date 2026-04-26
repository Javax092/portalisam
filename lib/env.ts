export function getRequiredEnv(name: "DATABASE_URL" | "JWT_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`A variavel de ambiente ${name} nao foi configurada.`);
  }

  return value;
}

export function getJwtSecret() {
  const value = getRequiredEnv("JWT_SECRET").trim();

  if (value.length < 32) {
    throw new Error("A variavel de ambiente JWT_SECRET deve ter pelo menos 32 caracteres.");
  }

  return value;
}
