"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type PublicNavProps = {
  items: ReadonlyArray<{
    href: string;
    label: string;
  }>;
  className?: string;
  onItemClick?: () => void;
};

export function PublicNav({ items, className, onItemClick }: PublicNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-3", className)}>
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            className={cn(
              "premium-focus rounded-full border px-4 py-2.5 text-sm font-semibold transition",
              active
                ? "border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-300/60"
                : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-white hover:text-slate-950",
            )}
            href={item.href}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
