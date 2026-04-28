"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, House, LayoutGrid, SquarePen } from "lucide-react";

import { cn } from "@/lib/utils";

const mobileNavItems = [
  {
    href: "/",
    label: "Inicio",
    icon: House,
  },
  {
    href: "/portal",
    label: "Portal",
    icon: LayoutGrid,
  },
  {
    href: "/reports",
    label: "Demandas",
    icon: ClipboardList,
  },
  {
    href: "/report",
    label: "Registrar",
    icon: SquarePen,
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-2 rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-[0_-14px_40px_rgba(15,23,42,0.08)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              className={cn(
                "premium-focus flex min-h-[4.25rem] flex-col items-center justify-center gap-1 rounded-[1.25rem] px-2 py-2 text-center transition",
                active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
              href={item.href}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="text-[11px] font-semibold tracking-[0.01em]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
