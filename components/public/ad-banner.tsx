import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type AdvertisementItem = Awaited<ReturnType<typeof import("@/lib/sponsors").getActiveAdvertisementsByPlacement>>[number];

type AdBannerProps = {
  advertisements: AdvertisementItem[];
  badgeLabel?: string;
  title?: string;
  className?: string;
};

export function AdBanner({
  advertisements,
  badgeLabel = "Apoio institucional",
  title,
  className,
}: AdBannerProps) {
  if (advertisements.length === 0) return null;

  const [featured, ...secondary] = advertisements;
  const featuredHref = featured.targetUrl || featured.sponsor.websiteUrl || featured.sponsor.whatsappUrl;

  return (
    <div className={className}>
      {title ? (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="muted">{badgeLabel}</Badge>
          <p className="text-sm font-semibold text-slate-700">{title}</p>
        </div>
      ) : null}

      <div className="grid gap-4">
        <Card className="overflow-hidden border-slate-200 bg-white">
          <CardContent className="grid gap-4 p-4 sm:grid-cols-[180px_1fr] sm:p-5">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={featured.title} className="h-full min-h-32 w-full object-cover" src={featured.imageUrl} />
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">{badgeLabel}</Badge>
                <Badge variant="muted">{featured.sponsor.category}</Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-slate-950">{featured.title}</h3>
                <p className="text-sm leading-7 text-slate-600">
                  {featured.description || featured.sponsor.description || "Parceiro local que apoia a comunicacao publica e iniciativas do territorio."}
                </p>
              </div>
              {featuredHref ? (
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
                  href={featuredHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  {featured.sponsor.name}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <p className="text-sm font-semibold text-slate-700">{featured.sponsor.name}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {secondary.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {secondary.slice(0, 2).map((ad) => {
              const href = ad.targetUrl || ad.sponsor.websiteUrl || ad.sponsor.whatsappUrl;

              return (
                <Card key={ad.id} className="h-full overflow-hidden border-slate-200 bg-white">
                  <CardContent className="space-y-4 p-4">
                    <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={ad.title} className="h-32 w-full object-cover" src={ad.imageUrl} />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="muted">{badgeLabel}</Badge>
                      <h4 className="text-lg font-bold tracking-tight text-slate-950">{ad.title}</h4>
                      <p className="text-sm leading-6 text-slate-600">{ad.description || ad.sponsor.name}</p>
                    </div>
                    {href ? (
                      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700" href={href} rel="noreferrer" target="_blank">
                        Visitar parceiro
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
