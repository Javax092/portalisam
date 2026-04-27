"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck, Waypoints, X } from "lucide-react";

import { PublicNav } from "@/components/public/public-nav";
import { SectionContainer } from "@/components/ui/section-container";
import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pt-4 text-slate-950">
      <SectionContainer>
        <div className="reveal-up rounded-[1.75rem] border border-slate-200 bg-white/95 px-4 py-3 shadow-soft shadow-slate-200/70 sm:px-5">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <Link className="flex min-w-0 items-center gap-3" href="/" onClick={() => setIsMobileNavOpen(false)}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm shadow-slate-300/60">
                <Waypoints className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  Portal oficial
                </div>
                <p className="mt-1 truncate text-base font-bold tracking-tight text-slate-950 sm:text-lg">
                  {siteConfig.portalName}
                </p>
                <p className="truncate text-xs text-slate-600 sm:text-sm">
                  {siteConfig.organizationName} • {siteConfig.neighborhoodName}
                </p>
              </div>
            </Link>

            <PublicNav className="hidden items-center gap-2 xl:flex" items={siteConfig.nav} />

            <div className="hidden items-center gap-2 md:flex">
              <Link className={buttonVariants({ size: "default", variant: "secondary" })} href="/report">
                Registrar demanda
              </Link>
              <WhatsAppCta label="Canal institucional" size="default" target="community" />
            </div>

            <button
              aria-expanded={isMobileNavOpen}
              aria-label="Abrir navegacao"
              className="premium-focus inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 xl:hidden"
              onClick={() => setIsMobileNavOpen((current) => !current)}
              type="button"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div
            className={cn(
              "overflow-hidden transition-[max-height] duration-200 xl:hidden",
              isMobileNavOpen ? "max-h-[32rem]" : "max-h-0",
            )}
          >
            <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4">
              <PublicNav
                className="flex-col items-stretch gap-2"
                items={siteConfig.nav}
                onItemClick={() => setIsMobileNavOpen(false)}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  className={cn(buttonVariants({ size: "default", variant: "secondary" }), "w-full")}
                  href="/report"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Registrar demanda
                </Link>
                <WhatsAppCta
                  className="w-full"
                  label="Canal institucional"
                  onClick={() => setIsMobileNavOpen(false)}
                  size="default"
                  target="community"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
