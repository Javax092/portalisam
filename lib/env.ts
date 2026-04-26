export function getRequiredEnv(name: "AUTH_SECRET" | "DATABASE_URL") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`A variavel de ambiente ${name} nao foi configurada.`);
  }

  return value;
}
