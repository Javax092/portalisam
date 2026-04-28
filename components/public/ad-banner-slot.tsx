import Link from "next/link";
import { AdPlacement } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { adBannerPositionLabels, type AdBannerPosition, getActiveAdBannersByPosition } from "@/lib/ad-banners";
import { getActiveAdvertisementsByPlacement } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

type AdBannerSlotProps = {
  position: AdBannerPosition;
  className?: string;
  maxItems?: 1 | 2;
  legacyPlacement?: AdPlacement;
};

type RenderBanner = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  href: string | null;
  sourceLabel: string;
};

export async function AdBannerSlot({
  position,
  className,
  maxItems,
  legacyPlacement,
}: AdBannerSlotProps) {
  const limit = maxItems ?? (position === "portal_sidebar" ? 1 : 2);
  const banners = await getActiveAdBannersByPosition(position, limit);

  let items: RenderBanner[] = banners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    description: banner.description,
    imageUrl: banner.imageUrl,
    href: banner.link,
    sourceLabel: "Patrocinador",
  }));

  if (items.length === 0 && legacyPlacement) {
    const legacyAds = await getActiveAdvertisementsByPlacement(legacyPlacement);
    items = legacyAds.slice(0, limit).map((ad) => ({
      id: ad.id,
      title: ad.title,
      description:
        ad.description ||
        ad.sponsor.description ||
        "Parceiro institucional com presenca editorial discreta no portal.",
      imageUrl: ad.imageUrl,
      href: ad.targetUrl || ad.sponsor.websiteUrl || ad.sponsor.whatsappUrl || null,
      sourceLabel: ad.sponsor.name,
    }));
  }

  if (items.length === 0) return null;

  const [featured, secondary] = items;

  if (position === "portal_sidebar") {
    return (
      <section className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="muted">Patrocinador</Badge>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {adBannerPositionLabels[position]}
          </p>
        </div>
        <AdCard banner={featured} compact />
      </section>
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="muted">Patrocinador</Badge>
        <p className="text-sm font-semibold text-slate-700">
          Espaco patrocinado com curadoria institucional.
        </p>
      </div>

      <AdCard banner={featured} />

      {secondary ? (
        <div className="grid gap-4 md:grid-cols-2">
          <AdCard banner={secondary} compact />
        </div>
      ) : null}
    </section>
  );
}

function AdCard({ banner, compact = false }: { banner: RenderBanner; compact?: boolean }) {
  const body = (
    <div
      className={cn(
        "group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] shadow-sm",
        compact ? "h-full" : "",
      )}
    >
      <div className={cn("grid gap-4 p-4 sm:p-5", compact ? "" : "lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center")}>
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={banner.title}
            className={cn(
              "w-full object-cover transition duration-300 group-hover:scale-[1.015]",
              compact ? "h-40" : "h-36 lg:h-32",
            )}
            src={banner.imageUrl}
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">Patrocinador</Badge>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Conteudo institucional
            </span>
          </div>

          <div className="space-y-2">
            <h3 className={cn("font-bold tracking-tight text-slate-950", compact ? "text-lg" : "text-xl")}>
              {banner.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600">
              {banner.description || "Parceiro com apoio institucional apresentado de forma objetiva e discreta."}
            </p>
          </div>

          {banner.href ? (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
              Conhecer patrocinador
              <ArrowUpRight className="h-4 w-4" />
            </span>
          ) : (
            <span className="text-sm font-semibold text-slate-700">{banner.sourceLabel}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (!banner.href) {
    return body;
  }

  return (
    <Link href={banner.href} rel="noreferrer" target="_blank">
      {body}
    </Link>
  );
}
