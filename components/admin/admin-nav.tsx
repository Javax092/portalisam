import { UserRole } from "@prisma/client";
import {
  BellRing,
  ClipboardList,
  LayoutDashboard,
  Settings2,
  CalendarRange,
} from "lucide-react";
import Link from "next/link";

import { canManageSensitiveSettings } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/notices", label: "Comunicados", icon: BellRing },
  { href: "/admin/events", label: "Agenda institucional", icon: CalendarRange },
  { href: "/admin/reports", label: "Demandas", icon: ClipboardList },
  { href: "/admin/settings", label: "Dados institucionais", icon: Settings2 },
] as const;

type AdminNavProps = {
  currentPath: string;
  userRole?: UserRole;
};

export function AdminNav({ currentPath, userRole }: AdminNavProps) {
  const visibleLinks = adminLinks.filter((link) => {
    if (link.href !== "/admin/settings") {
      return true;
    }

    return userRole ? canManageSensitiveSettings(userRole) : false;
  });

  return (
    <nav className="flex flex-col gap-2">
      {visibleLinks.map((link) => {
        const active =
          link.href === "/admin"
            ? currentPath === link.href
            : currentPath.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            className={cn(
              "premium-focus flex items-center justify-between gap-3 rounded-[1.25rem] border px-4 py-3 text-sm font-semibold transition",
              active
                ? "border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-300/60"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-sky-200 hover:text-slate-950",
            )}
            href={link.href}
          >
            <span className="inline-flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border",
                  active
                    ? "border-slate-700 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {link.label}
            </span>
            <span className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-emerald-300" : "bg-slate-200")} />
          </Link>
        );
      })}
    </nav>
  );
}
