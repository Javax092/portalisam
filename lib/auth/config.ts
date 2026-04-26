import { siteConfig } from "@/lib/site-config";

export const authConfig = {
  sessionCookie: "promorar_session",
  sessionMaxAgeInSeconds: 60 * 60 * 24 * 7,
  publicRoutes: ["/", "/login"],
  protectedRoutes: ["/admin"],
  loginRedirect: "/admin",
  loginPath: "/login",
  adminSeedEmail: siteConfig.adminEmail,
  adminSeedPassword: "123456",
} as const;
