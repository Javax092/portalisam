"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname.startsWith("/admin");

  return (
    <div className="relative flex min-h-screen flex-col">
      {hideChrome ? null : <SiteHeader />}
      <div className="flex-1">{children}</div>
      {hideChrome ? null : <SiteFooter />}
    </div>
  );
}
