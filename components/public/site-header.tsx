"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Waypoints, X } from "lucide-react";

import { PublicNav } from "@/components/public/public-nav";
import { SectionContainer } from "@/components/ui/section-container";
import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <SectionContainer className="py-4">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/" onClick={() => setIsMobileNavOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm shadow-slate-300/60">
              <Waypoints className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">{siteConfig.organizationName}</span>
              <span className="text-base font-semibold text-slate-950">{siteConfig.portalName}</span>
            </div>
          </Link>

          <PublicNav className="hidden md:flex" items={siteConfig.nav} />

          <div className="hidden md:block">
            <WhatsAppCta label="Quero apoiar" size="default" />
          </div>

          <button
            aria-expanded={isMobileNavOpen}
            aria-label="Abrir navegação"
            className="premium-focus inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 md:hidden"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            type="button"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-200 md:hidden",
            isMobileNavOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-4">
            <PublicNav
              className="flex-col items-start gap-4"
              items={siteConfig.nav}
              onItemClick={() => setIsMobileNavOpen(false)}
            />
            <WhatsAppCta
              className="w-full"
              label="Quero apoiar"
              onClick={() => setIsMobileNavOpen(false)}
              size="default"
            />
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
