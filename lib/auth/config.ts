export const authConfig = {
  sessionCookie: "portal_session",
  sessionMaxAgeInSeconds: 60 * 60 * 24 * 7,
  publicRoutes: ["/", "/login"],
  protectedRoutes: ["/admin"],
  loginRedirect: "/admin",
  loginPath: "/login",
} as const;
