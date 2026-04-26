import Link from "next/link";

import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/notices", label: "Avisos" },
  { href: "/admin/events", label: "Eventos" },
  { href: "/admin/reports", label: "Ocorrencias" },
  { href: "/admin/settings", label: "Dados da organização" },
] as const;

type AdminNavProps = {
  currentPath: string;
};

export function AdminNav({ currentPath }: AdminNavProps) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {adminLinks.map((link) => {
        const active =
          link.href === "/admin"
            ? currentPath === link.href
            : currentPath.startsWith(link.href);

        return (
          <Link
            key={link.href}
            className={cn(
              "premium-focus whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-sky-200/70"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:text-slate-950",
            )}
            href={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
