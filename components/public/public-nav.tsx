import Link from "next/link";

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
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          className="premium-focus rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          href={item.href}
          onClick={onItemClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
