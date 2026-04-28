import Link from "next/link";
import { AdPlacement } from "@prisma/client";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  ClipboardList,
  Landmark,
  Radar,
  ShieldCheck,
} from "lucide-react";

import { CommunityNoticeCard } from "@/components/public/community-notice-card";
import { AdBannerSlot } from "@/components/public/ad-banner-slot";
import { EventCard } from "@/components/public/event-card";
import { ReportCard } from "@/components/public/report-card";
import { SupportersSection } from "@/components/public/supporters-section";
import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PageContainer } from "@/components/ui/page-container";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate } from "@/lib/community";
import { getPortalOverview } from "@/lib/public-data";
import { getActiveSponsors } from "@/lib/sponsors";
import { siteConfig } from "@/lib/site";

export async function PortalOverview() {
  const [portalOverview, activeSponsors] = await Promise.all([
    getPortalOverview(),
    getActiveSponsors(),
  ]);
  const { notices, events, reportStats, recentReports } = portalOverview;
  const totalReports = reportStats.reduce(
    (acc, item) => acc + item._count._all,
    0,
  );
  const activeReports = reportStats
    .filter((item) => item.status !== "RESOLVED" && item.status !== "ARCHIVED")
    .reduce((acc, item) => acc + item._count._all, 0);
  const resolvedReports =
    reportStats.find((item) => item.status === "RESOLVED")?._count._all ?? 0;
  const featuredNotice =
    notices.find((notice) => notice.isFeatured) || notices[0];
  const secondaryNotices = featuredNotice
    ? notices.filter((notice) => notice.id !== featuredNotice.id)
    : notices;

  return (
    <PageContainer className="pt-2 sm:pt-4">
      <section className="safe-section overflow-hidden">
        <SectionContainer>
          <div className="reveal-up safe-section safe-card overflow-hidden rounded-[2rem]">
            <div className="relative z-10 grid gap-6 px-4 py-6 sm:px-8 sm:py-8 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">Painel de Atuação Comunitária</Badge>
                  <Badge>
                    <Radar className="h-3.5 w-3.5" />
                    Comunicados, agenda e demandas
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-balance text-[2rem] font-black tracking-tight text-slate-950 sm:text-5xl">
                    Comunicação publica e acompanhamento institucional
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                    Comunicados, eventos, demandas e indicadores reunidos em um
                    ambiente oficial para consulta da comunidade.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    className={buttonVariants({ size: "lg" })}
                    href="/report"
                  >
                    Registrar demanda
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    className={buttonVariants({
                      size: "lg",
                      variant: "secondary",
                    })}
                    href="/reports"
                  >
                    Acompanhar demandas
                  </Link>
                  <WhatsAppCta
                    className="hidden sm:inline-flex"
                    label="Canal institucional"
                    size="lg"
                    target="community"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    helper="publicações oficiais ativas"
                    icon={BellRing}
                    label="Comunicados"
                    tone="sky"
                    value={notices.length}
                  />
                  <MetricCard
                    helper="programação publica cadastrada"
                    icon={CalendarDays}
                    label="Agenda institucional"
                    tone="emerald"
                    value={events.length}
                  />
                  <MetricCard
                    helper="demandas em acompanhamento"
                    icon={ClipboardList}
                    label="Demandas ativas"
                    tone="cyan"
                    value={activeReports}
                  />
                  <MetricCard
                    helper="demandas concluidas"
                    icon={ShieldCheck}
                    label="Demandas resolvidas"
                    tone="amber"
                    value={resolvedReports}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <Card className="soft-float safe-section overflow-hidden safe-dark-card">
                  <CardContent className="p-6">
                    <div
                      aria-hidden="true"
                      className="safe-bg bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.06),_transparent_20%)]"
                    />
                    <div className="relative z-10 space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">
                            Canal oficial
                          </p>
                          <h2 className="mt-2 text-2xl font-bold tracking-tight">
                            Leitura publica do territorio
                          </h2>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-sky-200">
                          <Landmark className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                            Publicação principal
                          </p>
                          <p className="mt-2 font-semibold text-white">
                            {featuredNotice?.title ||
                              "Nenhum comunicado publicado."}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {featuredNotice
                              ? `Publicado em ${formatDate(featuredNotice.publishedAt || featuredNotice.createdAt)}`
                              : "As publicações oficiais serao destacadas neste espaço conforme forem cadastradas."}
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                            Panorama rapido
                          </p>
                          <p className="mt-2 text-3xl font-black tracking-tight text-white">
                            {totalReports}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            Registros comunitarios com status, prioridade e
                            historico de atualizacao.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-2">
                      <Badge variant="muted">Governança institucional</Badge>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                        Governança comunitaria e transparencia publica
                      </h2>
                      <p className="text-sm leading-7 text-slate-700">
                        O Painel de Atuação Comunitária organiza comunicados,
                        registros comunitarios, agenda institucional e
                        indicadores publicos em um ambiente oficial de consulta,
                        fortalecendo a confianca entre comunidade, equipe e
                        parceiros.
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-semibold text-slate-950">
                          Comunicação oficial
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Publicações institucionais centralizadas para consulta
                          publica.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-semibold text-slate-950">
                          Acompanhamento territorial
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Demandas registradas com status, prioridade e
                          historico de atualizacao.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-sm font-semibold text-slate-950">
                          Prestação de contas
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Indicadores e registros organizados para ampliar
                          transparencia e responsabilidade publica.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link
                        className={buttonVariants({ size: "default" })}
                        href="/report"
                      >
                        Registrar demanda
                      </Link>
                      <Link
                        className={buttonVariants({
                          size: "default",
                          variant: "secondary",
                        })}
                        href="/reports"
                      >
                        Acompanhar demandas
                      </Link>
                      <WhatsAppCta
                        className="hidden sm:inline-flex"
                        label="Canal institucional"
                        size="default"
                        target="community"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      <SectionContainer className="space-y-4">
        <AdBannerSlot position="portal_top" />
      </SectionContainer>

      <SectionContainer className="ds-section grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-8">
          <section className="space-y-5">
            <SectionHeader
              eyebrow="Comunicado em destaque"
              description="A principal publicacao institucional permanece destacada com contexto, data e leitura imediata."
              title="Comunicado oficial em destaque"
            />

            <Card className="interactive-border overflow-hidden">
              <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {featuredNotice?.category ? (
                      <Badge variant="muted">{featuredNotice.category}</Badge>
                    ) : null}
                    {featuredNotice?.isFeatured ? (
                      <Badge>Prioridade editorial</Badge>
                    ) : null}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                    {featuredNotice?.title ||
                      "Nenhum comunicado oficial em destaque."}
                  </h2>
                  <p className="text-base leading-8 text-slate-700">
                    {featuredNotice?.description ||
                      "As publicacoes institucionais prioritarias serao exibidas neste espaco."}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Publicado em
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {featuredNotice
                        ? formatDate(
                            featuredNotice.publishedAt ||
                              featuredNotice.createdAt,
                          )
                        : "Sem data definida"}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Governanca editorial
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Comunicados oficiais podem receber destaque sem
                      comprometer a leitura das demais secoes publicas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Comunicados oficiais"
              description="Publicacoes institucionais com leitura objetiva para consulta publica."
              title="Atualizacoes publicas recentes"
            />

            {secondaryNotices.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {secondaryNotices.map((notice) => (
                  <CommunityNoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            ) : (
              <EmptyState
                description="As publicacoes oficiais serao listadas conforme novos comunicados forem cadastrados."
                title="Nenhum comunicado publicado."
              />
            )}
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Agenda institucional"
              description="Programacao publica de acoes comunitarias, mobilizacoes territoriais e encontros institucionais."
              title="Programacao publica"
            />

            {events.length > 0 ? (
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                description="A agenda institucional sera exibida conforme novos eventos forem cadastrados."
                title="Nenhum evento cadastrado."
              />
            )}
          </section>

          <section className="space-y-5">
            <SectionHeader
              eyebrow="Demandas territoriais"
              description="Registros comunitarios publicados com status, prioridade e contexto territorial."
              title="Demandas em acompanhamento"
              action={
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/reports"
                >
                  Ver todas as demandas
                </Link>
              }
            />

            {recentReports.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {recentReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <EmptyState
                description="Os registros comunitarios serao listados conforme novas solicitacoes forem recebidas."
                title="Nenhuma demanda registrada."
              />
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="overflow-hidden border border-slate-200 bg-white shadow-lg">
            <CardContent className="relative p-6">
              <div className="relative z-10 space-y-5">
                <div className="space-y-2">
                  <Badge variant="muted">Consulta publica</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Comunicacao oficial, registros comunitarios e acompanhamento
                    territorial em um unico ambiente publico.
                  </h2>
                </div>
                <p className="text-sm leading-7 text-slate-700">
                  As informacoes publicas sao organizadas para fortalecer
                  consulta, acompanhamento e transparencia comunitaria.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    className="inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
                    href="/report"
                  >
                    Registrar demanda
                  </Link>
                  <Link
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                    href="/reports"
                  >
                    Acompanhar demandas
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <AdBannerSlot
            legacyPlacement={AdPlacement.PORTAL_SIDEBAR}
            position="portal_sidebar"
          />

          <Card className="glass-panel border-slate-200/90">
            <CardContent className="space-y-4 p-6">
              <Badge variant="muted">Canal oficial</Badge>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Canal institucional para contato com a equipe
              </h2>
              <p className="text-sm leading-7 text-slate-700">
                O portal concentra informacoes publicas, enquanto o WhatsApp
                institucional permanece disponivel para orientacoes e
                encaminhamentos oficiais.
              </p>
              <div className="grid gap-3">
                <WhatsAppCta
                  className="w-full"
                  label="Canal institucional"
                  size="default"
                  target="community"
                />
                <Link
                  className={buttonVariants({
                    size: "default",
                    variant: "secondary",
                  })}
                  href="/reports"
                >
                  Ver mapa e lista de demandas
                </Link>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {siteConfig.organizationName} • {siteConfig.neighborhoodName}
              </div>
            </CardContent>
          </Card>
        </aside>
      </SectionContainer>

      <SectionContainer className="space-y-4">
        <AdBannerSlot
          legacyPlacement={AdPlacement.PORTAL_BOTTOM}
          position="portal_footer"
        />
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <SupportersSection
          badgeLabel="Apoio institucional"
          description="Parceiros locais que fortalecem acoes comunitarias, comunicacao publica e iniciativas do territorio."
          sponsors={activeSponsors}
          title="Parceiros do territorio"
        />
      </SectionContainer>
    </PageContainer>
  );
}
