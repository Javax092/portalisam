import Link from "next/link";
import { BadgeCheck, Building2, Megaphone, Store } from "lucide-react";

import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SponsoredBanner } from "@/components/ui/sponsored-banner";
import { siteConfig } from "@/lib/site";

const defaultBusinesses = [
  {
    name: "Mercadinho Esperança",
    description: "Compras do dia a dia com atendimento próximo da comunidade.",
    category: "Mercado de bairro",
  },
  {
    name: "Farmácia Vida Local",
    description: "Apoio a campanhas sociais, vacinação e orientações básicas.",
    category: "Saúde",
  },
  {
    name: "Padaria Bom Encontro",
    description: "Café da manhã, encomendas e apoio a eventos da vizinhança.",
    category: "Alimentação",
  },
] as const;

type LocalBusinessCardProps = {
  name: string;
  description: string;
  category: string;
  whatsappHref?: string;
};

export function LocalBusinessCard({
  name,
  description,
  category,
  whatsappHref = siteConfig.whatsappCommunityLink,
}: LocalBusinessCardProps) {
  return (
    <Card className="premium-card-hover h-full rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700" variant="muted">
              Apoiador local
            </Badge>
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">{name}</h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
            <Store className="h-5 w-5" />
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            {category}
          </div>
          <Link
            className={buttonVariants({
              className: "rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500",
              size: "sm",
            })}
            href={whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            WhatsApp
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

type SponsoredCardProps = {
  title: string;
  description: string;
};

export function SponsoredCard({ title, description }: SponsoredCardProps) {
  return (
    <Card className="premium-card-hover rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="space-y-4 p-5">
        <Badge className="border-amber-200 bg-amber-50 text-amber-700" variant="muted">
          Apoiador local
        </Badge>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 shadow-sm">
            <Megaphone className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type SupporterSectionProps = {
  title?: string;
  description?: string;
  businesses?: readonly LocalBusinessCardProps[];
  compact?: boolean;
};

export function SupporterSection({
  title = "Negócios apoiadores",
  description = "Espaços visuais prontos para destacar parceiros do território, campanhas locais e banners patrocinados sem quebrar a experiência comunitária.",
  businesses = defaultBusinesses,
  compact = false,
}: SupporterSectionProps) {
  return (
    <div className="space-y-6">
      {!compact ? (
        <SectionHeader
          eyebrow="Monetização preparada"
          title={title}
          description={description}
          action={
            <WhatsAppCta className="h-11 px-5 text-sm" size="default" />
          }
        />
      ) : null}

      <SponsoredBanner compact={compact} description="Sua marca pode apoiar ações do bairro e aparecer com leitura clara no portal." title="Anuncie para a comunidade" />

      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
        {businesses.map((business) => (
          <LocalBusinessCard key={business.name} {...business} />
        ))}
      </div>

      <Card className="border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 shadow-sm shadow-emerald-100/60">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Building2 className="h-4 w-4" />
              Anuncie aqui
            </div>
            <p className="text-base font-semibold text-slate-950">
              Dê visibilidade ao seu negócio e fortaleça iniciativas locais no mesmo espaço.
            </p>
          </div>
          <WhatsAppCta className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500" label="Quero anunciar" />
        </CardContent>
      </Card>
    </div>
  );
}
