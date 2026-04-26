import Link from "next/link";
import { SectionContainer } from "@/components/ui/section-container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <SectionContainer className="py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-950">{siteConfig.portalName}</p>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Portal comunitário da ONG {siteConfig.organizationName} para comunicação, ações sociais e demandas do
              território.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
