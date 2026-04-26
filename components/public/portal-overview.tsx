import Link from "next/link";
import { ArrowRight, BellRing, CalendarDays, ClipboardList, MapPin, Megaphone } from "lucide-react";

import { CommunityNoticeCard } from "@/components/public/community-notice-card";
import { EventCard } from "@/components/public/event-card";
import { ReportCard } from "@/components/public/report-card";
import { LocalBusinessCard } from "@/components/public/supporter-section";
import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SponsoredBanner } from "@/components/ui/sponsored-banner";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate } from "@/lib/community";
import { getPortalOverview } from "@/lib/public-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function PortalOverview() {
  const { notices, events, reportStats, recentReports } = await getPortalOverview();
  const totalOpenReports = reportStats
    .filter((item) => item.status !== "RESOLVED" && item.status !== "ARCHIVED")
    .reduce((acc, item) => acc + item._count._all, 0);
  const featuredNotice = notices.find((notice) => notice.isFeatured) || notices[0];
  const recentNotices = featuredNotice ? notices.filter((notice) => notice.id !== featuredNotice.id) : notices;

  const supporterBusinesses = [
    {
      name: "Mercadinho Esperança",
      category: "Mercado de bairro",
      description: "Compras do dia a dia com atendimento próximo e apoio a ações do território.",
    },
    {
      name: "Farmácia Vida Local",
      category: "Saúde",
      description: "Orientação básica, campanhas de cuidado e presença útil para a comunidade.",
    },
    {
      name: "Padaria Bom Encontro",
      category: "Alimentação",
      description: "Encomendas, café da manhã e parceria frequente em eventos locais.",
    },
  ] as const;

  const portalPrimaryButtonClassName =
    "rounded-2xl border-slate-950 bg-slate-950 px-5 py-3 font-semibold text-white hover:-translate-y-0.5 hover:border-slate-800 hover:bg-slate-800 hover:text-white";
  const portalSecondaryButtonClassName =
    "rounded-2xl border-slate-200 bg-white px-5 py-3 text-slate-900 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/70 sm:p-8">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-3">
              <Badge>Portal da comunidade</Badge>
              <h1 className="text-slate-950 font-bold tracking-tight text-4xl sm:text-5xl">
                Portal da comunidade
              </h1>
              <p className="max-w-3xl text-slate-600 leading-7">
                Avisos, eventos, demandas e apoiadores locais em um só lugar.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-3 sm:p-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Leitura rápida</p>
                <p className="text-sm leading-6 text-slate-700">Resumo claro do que está ativo agora no portal.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Atualização pública</p>
                <p className="text-sm leading-6 text-slate-700">Avisos, agenda e demandas organizados em blocos curtos.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Apoio local</p>
                <p className="text-sm leading-6 text-slate-700">Espaço próprio para apoiadores sem poluir a informação principal.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard helper="comunicados visíveis agora" icon={BellRing} label="Avisos ativos" tone="sky" value={notices.length} />
              <StatCard helper="encontros programados" icon={CalendarDays} label="Próximos eventos" tone="emerald" value={events.length} />
              <StatCard helper="casos ainda acompanhados" icon={ClipboardList} label="Demandas acompanhadas" tone="amber" value={totalOpenReports} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={cn(buttonVariants({ size: "default", variant: "secondary" }), portalPrimaryButtonClassName)} href="/report">
                Reportar problema
              </Link>
              <Link className={cn(buttonVariants({ size: "default", variant: "secondary" }), portalSecondaryButtonClassName)} href="/reports">
                Ver demandas
              </Link>
              <WhatsAppCta label="Quero anunciar" size="default" />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-slate-200 bg-slate-950 text-white">Aviso em destaque</Badge>
                {featuredNotice?.category ? <Badge variant="muted">{featuredNotice.category}</Badge> : null}
              </div>
              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(220px,0.9fr)]">
                <div className="space-y-4">
                  <h2 className="text-slate-950 font-bold tracking-tight text-3xl">
                    {featuredNotice?.title || "Publique um aviso importante para abrir o portal com clareza"}
                  </h2>
                  <p className="text-slate-600 leading-7">
                    {featuredNotice?.description || "Aqui fica o principal recado do dia para moradores, voluntários e lideranças locais."}
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Publicado em</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">
                      {featuredNotice ? formatDate(featuredNotice.publishedAt || featuredNotice.createdAt) : "Sem aviso publicado"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Leitura rápida</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      O principal recado do portal aparece primeiro, com contexto claro e contraste suficiente.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-slate-950 font-bold tracking-tight text-3xl">Avisos recentes</h2>
                <p className="text-slate-600 leading-7">Comunicados do território organizados para leitura simples, com menos ruído visual e melhor prioridade editorial.</p>
              </div>
              {recentNotices.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {recentNotices.map((notice) => (
                    <CommunityNoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="Quando um novo aviso for publicado, ele aparecerá aqui em leitura objetiva."
                  title="Nenhum aviso recente no momento"
                />
              )}
            </section>

            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-slate-950 font-bold tracking-tight text-3xl">Próximos eventos</h2>
                <p className="text-slate-600 leading-7">Encontros, ações e programações com data em destaque para facilitar decisão rápida no celular ou no desktop.</p>
              </div>
              {events.length > 0 ? (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="Assim que um evento for cadastrado, ele aparecerá aqui com data, horário e local."
                  title="Nenhum evento agendado"
                />
              )}
            </section>

            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-slate-950 font-bold tracking-tight text-3xl">Demandas recentes</h2>
                <p className="text-slate-600 leading-7">Acompanhamento público com contexto suficiente para entender o estágio, a prioridade e a atualização mais recente.</p>
              </div>
              {recentReports.length > 0 ? (
                <div className="grid gap-4">
                  {recentReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  description="As próximas demandas públicas aparecerão aqui com status e atualização recente."
                  title="Ainda não há demandas recentes"
                />
              )}
              <div>
                <Link className={cn(buttonVariants({ size: "default", variant: "secondary" }), portalPrimaryButtonClassName)} href="/reports">
                  Ver todas as demandas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <SponsoredBanner
              badgeLabel="Apoiador local"
              ctaLabel="Quero anunciar"
              description="Apresente sua marca para moradores e lideranças em um espaço claro, confiável e pronto para operação real."
              title="Anuncie para a comunidade"
            />

            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-slate-950 font-bold tracking-tight text-2xl">Negócios apoiadores</h2>
                <p className="text-slate-600 leading-7">Uma vitrine curta e objetiva para apoiadores locais, com descrição enxuta e contato direto.</p>
              </div>
              <div className="grid gap-4">
                {supporterBusinesses.map((business) => (
                  <LocalBusinessCard key={business.name} {...business} />
                ))}
              </div>
            </section>

            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
              <CardContent className="space-y-4 p-0">
                <Badge className="border-slate-200 bg-slate-100 text-slate-700" variant="muted">
                  Institucional
                </Badge>
                <div className="space-y-2">
                  <h2 className="text-slate-950 font-bold tracking-tight text-2xl">Portal da sua organização</h2>
                  <p className="text-slate-600 leading-7">
                    Configure dados reais da ONG, igreja ou associação e mantenha a comunidade informada.
                  </p>
                </div>
                <Link className={cn(buttonVariants({ size: "default", variant: "secondary" }), "w-full", portalPrimaryButtonClassName)} href="/login">
                  Entrar no painel
                </Link>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-slate-950 font-bold tracking-tight text-xl">Ações rápidas</h2>
                    <p className="text-sm text-slate-500">Atalhos públicos do portal.</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Link className={cn(buttonVariants({ size: "default", variant: "secondary" }), "justify-start", portalSecondaryButtonClassName)} href="/report">
                    Reportar problema
                  </Link>
                  <Link className={cn(buttonVariants({ size: "default", variant: "secondary" }), "justify-start", portalSecondaryButtonClassName)} href="/reports">
                    Ver demandas
                  </Link>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                      Cobertura pública
                    </div>
                    Acompanhamento visível para moradores com foco em leitura rápida no celular e no desktop.
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
