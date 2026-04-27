import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type SponsoredBannerProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  badgeLabel?: string;
  compact?: boolean;
  className?: string;
};

export function SponsoredBanner({
  title,
  description,
  ctaLabel = "Quero anunciar",
  ctaHref = siteConfig.whatsappAdsLink,
  badgeLabel = "Apoiador local",
  compact = false,
  className,
}: SponsoredBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm shadow-slate-300/20",
        className,
      )}
    >
      <div className={cn("relative flex flex-col gap-5", !compact && "lg:flex-row lg:items-center lg:justify-between")}>
        <div className="space-y-3">
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700" variant="muted">
            {badgeLabel}
          </Badge>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-slate-100">
            <Megaphone className="h-4 w-4 text-emerald-300" />
            anuncio com destaque e leitura limpa
          </div>
        </div>
        <Link
          className="premium-focus inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-500 sm:w-auto"
          href={ctaHref}
          rel="noreferrer"
          target="_blank"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
