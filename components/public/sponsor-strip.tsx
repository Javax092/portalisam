import Link from "next/link";
import { Globe2, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SponsorItem = Awaited<ReturnType<typeof import("@/lib/sponsors").getActiveSponsors>>[number];

type SponsorStripProps = {
  sponsors: SponsorItem[];
  title?: string;
  description?: string;
  badgeLabel?: string;
};

export function SponsorStrip({
  sponsors,
  title = "Apoiadores institucionais",
  description = "Parceiros locais que fortalecem acoes comunitarias, comunicacao publica e iniciativas do territorio.",
  badgeLabel = "Apoio institucional",
}: SponsorStripProps) {
  if (sponsors.length === 0) return null;

  return (
    <Card className="overflow-hidden border-slate-200 bg-white">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="space-y-3">
          <Badge variant="muted">{badgeLabel}</Badge>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sponsors.map((sponsor) => {
            const href = sponsor.websiteUrl || sponsor.whatsappUrl;

            return (
              <div key={sponsor.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {sponsor.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img alt={sponsor.name} className="h-full w-full object-cover" src={sponsor.logoUrl} />
                    ) : (
                      <span className="text-sm font-black text-slate-700">{sponsor.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-semibold text-slate-950">{sponsor.name}</p>
                    <p className="text-sm text-slate-600">{sponsor.category}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {sponsor.description || "Parceiro local em apoio institucional ao portal e as acoes comunitarias."}
                </p>
                {href ? (
                  <Link className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700" href={href} rel="noreferrer" target="_blank">
                    {sponsor.websiteUrl ? <Globe2 className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                    Conhecer parceiro
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
