"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationLinksProps = {
  page: number;
  totalPages: number;
};

export function PaginationLinks({ page, totalPages }: PaginationLinksProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function buildHref(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          aria-disabled={page <= 1}
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            page <= 1 && "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 shadow-none hover:translate-y-0",
          )}
          href={buildHref(page - 1)}
        >
          Anterior
        </Link>
        <Link
          aria-disabled={page >= totalPages}
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            page >= totalPages && "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 shadow-none hover:translate-y-0",
          )}
          href={buildHref(page + 1)}
        >
          Proxima
        </Link>
      </div>
    </div>
  );
}
