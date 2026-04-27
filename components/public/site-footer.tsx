import Link from "next/link";
import { ArrowRight, Landmark, MessageCircle, ShieldCheck } from "lucide-react";

import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { buttonVariants } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-900">
      <SectionContainer className="py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-soft shadow-slate-200/70 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                  <Landmark className="h-3.5 w-3.5 text-sky-700" />
                  Transparencia publica
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold tracking-tight text-slate-950">{siteConfig.portalName}</p>
                  <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    Portal institucional da ONG {siteConfig.organizationName} para comunicacao publica,
                    registros comunitarios, agenda institucional e prestacao de contas.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link className={buttonVariants({ size: "default" })} href="/report">
                    Registrar demanda
                  </Link>
                  <WhatsAppCta label="Canal institucional" size="default" target="community" />
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    Canal oficial
                  </div>
                  <p className="leading-6 text-slate-600">
                    Comunicados oficiais, indicadores publicos e acompanhamento territorial em ambiente confiavel.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                    <MessageCircle className="h-4 w-4 text-sky-700" />
                    Comunicacao institucional
                  </div>
                  <p className="leading-6 text-slate-600">
                    O WhatsApp institucional permanece disponivel para contato oficial e articulacao comunitaria.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/90 bg-slate-950 p-6 text-white shadow-soft shadow-slate-300/50 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">Navegacao</p>
            <div className="mt-4 grid gap-3">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  className={cn(
                    buttonVariants({ size: "default", variant: "ghost" }),
                    "justify-between rounded-[1.25rem] border border-white/10 bg-slate-900 px-4 text-white hover:bg-slate-800 hover:text-white",
                  )}
                  href={item.href}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-sky-200" />
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-300">
              {siteConfig.organizationName} • {siteConfig.neighborhoodName}
            </p>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
