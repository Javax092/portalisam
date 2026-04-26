import { authConfig } from "@/lib/auth/config";

export const adminSeedCredentials = {
  email: authConfig.adminSeedEmail,
  password: authConfig.adminSeedPassword,
} as const;
