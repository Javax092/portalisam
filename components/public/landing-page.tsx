import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Eye,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { ReportCard } from "@/components/public/report-card";
import { WhatsAppCta } from "@/components/public/whatsapp-cta";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PageContainer } from "@/components/ui/page-container";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate, reportStatusLabels } from "@/lib/community";
import { getPortalOverview } from "@/lib/public-data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const pillars = [
  {
    number: "01",
    title: "Comunicacao oficial",
    description:
      "Publicacoes institucionais centralizadas para consulta publica.",
  },
  {
    number: "02",
    title: "Acompanhamento territorial",
    description:
      "Demandas registradas com status, prioridade e historico de atualizacao.",
  },
  {
    number: "03",
    title: "Prestacao de contas",
    description:
      "Indicadores e registros organizados para ampliar transparencia e responsabilidade publica.",
  },
] as const;

const trustItems = [
  {
    title: "Portal oficial integrado",
    description:
      "A plataforma centraliza comunicacao institucional, registros comunitarios e acompanhamento territorial em ambiente unico.",
    icon: ShieldCheck,
  },
  {
    title: "Governanca com rastreabilidade",
    description:
      "Cada demanda pode evoluir com historico de atualizacao, priorizacao operacional e leitura publica objetiva.",
    icon: Eye,
  },
  {
    title: "Presenca digital institucional",
    description:
      "A experiencia prioriza clareza visual, acesso por celular e confianca para operacao real da ONG.",
    icon: Radar,
  },
] as const;

export async function LandingPage() {
  const { notices, recentReports, reportStats } = await getPortalOverview();
  const totalReports = reportStats.reduce((acc, item) => acc + item._count._all, 0);
  const activeReports = reportStats
    .filter((item) => item.status !== "RESOLVED" && item.status !== "ARCHIVED")
    .reduce((acc, item) => acc + item._count._all, 0);
  const resolvedReports = reportStats.find((item) => item.status === "RESOLVED")?._count._all ?? 0;

  return (
    <PageContainer className="pt-4 sm:pt-6">
      <section className="safe-section overflow-hidden">
        <div aria-hidden="true" className="hero-orb hero-orb-one -z-10 pointer-events-none" />
        <div aria-hidden="true" className="hero-orb hero-orb-two -z-10 pointer-events-none" />
        <SectionContainer className="relative">
          <div className="section-glow reveal-up safe-section safe-card overflow-hidden rounded-[2rem]">
            <div aria-hidden="true" className="safe-bg hero-sheen" />
            <div aria-hidden="true" className="safe-bg tech-mesh opacity-15" />
            <div className="relative z-10 grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-12">
              <div className="space-y-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-slate-200 bg-white text-slate-700" variant="muted">
                    Portal oficial
                  </Badge>
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5" />
                    Governanca comunitaria
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-[4rem] lg:leading-[1.04]">
                    Portal institucional para comunicacao oficial, transparencia e acompanhamento territorial.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                    O ISAM Conectado centraliza comunicados, agenda publica, demandas comunitarias e
                    indicadores de acompanhamento em uma experiencia digital clara, segura e acessivel.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link className={buttonVariants({ size: "lg" })} href="/report">
                    Registrar demanda
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link className={buttonVariants({ size: "lg", variant: "secondary" })} href="/portal">
                    Acessar portal publico
                  </Link>
                  <WhatsAppCta label="Canal institucional" size="lg" target="community" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Governanca local
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Registros comunitarios e atualizacoes operacionais reunidos em fluxo institucional.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Transparencia publica
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Comunicados oficiais, agenda institucional e indicadores publicos em consulta aberta.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Acompanhamento territorial
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Registros publicos organizados para fortalecer consulta, acompanhamento e transparencia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="safe-section overflow-hidden safe-dark-card">
                  <CardContent className="p-6 sm:p-7">
                    <div
                      aria-hidden="true"
                      className="safe-bg bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.06),_transparent_20%)]"
                    />
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">
                            Leitura executiva
                          </p>
                          <h2 className="mt-2 text-2xl font-bold tracking-tight">
                            Panorama institucional do portal.
                          </h2>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-sky-200">
                          <Workflow className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                            Comunicado mais recente
                          </p>
                          <p className="mt-2 font-semibold text-white">
                            {notices[0]?.title || "Nenhum comunicado publicado."}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {notices[0]
                              ? `Publicado em ${formatDate(notices[0].publishedAt || notices[0].createdAt)}`
                              : "As publicacoes oficiais serao exibidas neste espaco conforme forem cadastradas."}
                          </p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                            Status predominante
                          </p>
                          <p className="mt-2 font-semibold text-white">
                            {recentReports[0] ? reportStatusLabels[recentReports[0].status] : "Sem demandas registradas"}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {recentReports[0]
                              ? "O acompanhamento territorial permanece disponivel com leitura publica objetiva."
                              : "Os indicadores de acompanhamento serao exibidos quando houver registros comunitarios."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    className="reveal-up stagger-1"
                    emphasis="strong"
                    helper="volume total recebido no portal"
                    icon={ClipboardList}
                    label="Demandas registradas"
                    tone="navy"
                    value={totalReports}
                  />
                  <MetricCard
                    className="reveal-up stagger-2"
                    helper="casos ainda em acompanhamento"
                    icon={Radar}
                    label="Demandas em acompanhamento"
                    tone="cyan"
                    value={activeReports}
                  />
                  <MetricCard
                    className="reveal-up stagger-3"
                    helper="casos com retorno e fechamento"
                    icon={CheckCircle2}
                    label="Demandas resolvidas"
                    tone="emerald"
                    value={resolvedReports}
                  />
                  <MetricCard
                    className="reveal-up stagger-4"
                    helper="publicacoes oficiais ativas"
                    icon={BellRing}
                    label="Comunicados publicados"
                    tone="sky"
                    value={notices.length}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      <SectionContainer className="ds-section space-y-12">
        <SectionHeader
          align="center"
          eyebrow="Governanca institucional"
          description="O ISAM Conectado organiza comunicados, registros comunitarios, agenda institucional e indicadores publicos em um ambiente oficial de consulta, fortalecendo a confianca entre comunidade, equipe e parceiros."
          title="Governanca comunitaria e transparencia publica"
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.number} className="interactive-border premium-card-hover overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-lg font-black text-sky-800">
                  {pillar.number}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">{pillar.title}</h3>
                  <p className="text-sm leading-7 text-slate-700 sm:text-base">{pillar.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link className={buttonVariants({ size: "lg" })} href="/report">
            Registrar demanda
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className={buttonVariants({ size: "lg", variant: "secondary" })} href="/reports">
            Acompanhar demandas
          </Link>
          <WhatsAppCta label="Canal institucional" size="lg" target="community" />
        </div>
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <SectionHeader
          eyebrow="Demandas territoriais"
          description="Registros comunitarios publicados com status, prioridade e historico de acompanhamento."
          title="Demandas em acompanhamento no territorio"
          action={
            <Link className={buttonVariants({ variant: "secondary" })} href="/reports">
              Acessar indicadores publicos
            </Link>
          }
        />

        {recentReports.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
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
      </SectionContainer>

      <SectionContainer className="ds-section">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Confianca e transparencia"
              description="Clareza, previsibilidade e leitura publica objetiva sustentam a confianca institucional."
              title="Comunicacao institucional com presenca territorial"
            />

            <div className="grid gap-4">
              {trustItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="interactive-border premium-card-hover">
                    <CardContent className="flex gap-4 p-5 sm:p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight text-slate-950">{item.title}</h3>
                        <p className="text-sm leading-7 text-slate-700 sm:text-base">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="safe-section overflow-hidden safe-dark-card">
            <CardContent className="p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="safe-bg bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.1),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.06),_transparent_20%)]"
              />
              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <Badge className="border-white/10 bg-slate-900 text-white">Canal oficial</Badge>
                  <h3 className="text-3xl font-bold tracking-tight">
                    Canal institucional para articulacao comunitaria
                  </h3>
                  <p className="text-sm leading-7 text-slate-200 sm:text-base">
                    O portal concentra registros comunitarios, acompanhamento publico e comunicacao
                    institucional com leitura objetiva e responsiva.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Link className={cn(buttonVariants({ size: "lg" }), "w-full")} href="/portal">
                    Acessar portal publico
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <WhatsAppCta className="w-full" label="Canal institucional" size="lg" target="community" />
                  <Link
                    className={cn(
                      buttonVariants({ size: "lg", variant: "ghost" }),
                      "w-full border border-white/10 bg-slate-900 text-white hover:bg-slate-800 hover:text-white",
                    )}
                    href="/reports"
                  >
                    Acompanhar demandas
                  </Link>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4 text-sm leading-6 text-slate-200">
                  {siteConfig.organizationName} • {siteConfig.neighborhoodName} • Presenca digital
                  institucional para transparencia publica, governanca local e acompanhamento territorial.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
