import Link from "next/link";
import { AdPlacement } from "@prisma/client";
import {
  ClipboardList,
  MapPinned,
  Radar,
  SearchCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { AdBannerSlot } from "@/components/public/ad-banner-slot";
import { ReportCard } from "@/components/public/report-card";
import { ReportsFilters } from "@/components/public/reports-filters";
import { ReportsMapSection } from "@/components/public/reports-map-section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { PageContainer } from "@/components/ui/page-container";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicReports } from "@/lib/public-data";
import { normalizePage } from "@/lib/reports";
import type { PublicReportMapItem } from "@/lib/types/public";

type ReportsOverviewProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function ReportsOverview({ searchParams }: ReportsOverviewProps) {
  const resolvedParams = (await searchParams) || {};
  const query = typeof resolvedParams.query === "string" ? resolvedParams.query : undefined;
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;
  const priority = typeof resolvedParams.priority === "string" ? resolvedParams.priority : undefined;
  const neighborhood =
    typeof resolvedParams.neighborhood === "string" ? resolvedParams.neighborhood : undefined;
  const page = normalizePage(typeof resolvedParams.page === "string" ? resolvedParams.page : undefined);

  const { reports, pagination } = await getPublicReports({
    query,
    category,
    status,
    priority,
    neighborhood,
    page,
  });

  const mapItems: PublicReportMapItem[] = reports.map((report) => ({
    id: report.id,
    title: report.title,
    category: report.category,
    severity: report.severity,
    status: report.status,
    neighborhood: report.neighborhood,
    address: report.address,
    latitude: report.latitude ? Number(report.latitude) : null,
    longitude: report.longitude ? Number(report.longitude) : null,
    createdAt: report.createdAt.toISOString(),
  }));

  const reportsWithoutCoordinates = reports.filter(
    (report) => report.latitude === null || report.longitude === null,
  );
  const reportsWithCoordinates = reports.length - reportsWithoutCoordinates.length;
  const urgentReports = reports.filter((report) => report.severity === "URGENT").length;

  return (
    <PageContainer className="pt-4 sm:pt-6">
      <section className="safe-section overflow-hidden">
        <SectionContainer className="space-y-6">
          <div className="reveal-up safe-section safe-card overflow-hidden rounded-[2rem]">
            <div className="relative z-10 grid gap-6 px-4 py-6 sm:px-8 sm:py-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">Demandas territoriais</Badge>
                  <Badge>
                    <Radar className="h-3.5 w-3.5" />
                    Indicadores publicos
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-balance text-[2rem] font-black tracking-tight text-slate-950 sm:text-5xl">
                    Demandas registradas pela comunidade
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                    Acompanhamento publico de solicitacoes comunitarias com status, prioridade,
                    categoria e historico de atualizacao.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link className={buttonVariants({ size: "lg" })} href="/report">
                    Registrar demanda
                  </Link>
                  <Link className={buttonVariants({ size: "lg", variant: "secondary" })} href="/portal">
                    Voltar ao portal publico
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard
                    helper="registros encontrados com os filtros atuais"
                    icon={ClipboardList}
                    label="Demandas registradas"
                    tone="sky"
                    value={pagination.totalItems}
                  />
                  <MetricCard
                    helper="registros posicionados no mapa publico"
                    icon={MapPinned}
                    label="No mapa"
                    tone="emerald"
                    value={reportsWithCoordinates}
                  />
                  <MetricCard
                    helper="registros com prioridade maxima nesta pagina"
                    icon={TriangleAlert}
                    label="Urgentes"
                    tone="amber"
                    value={urgentReports}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <Card className="safe-section overflow-hidden safe-dark-card">
                  <CardContent className="p-6">
                    <div
                      aria-hidden="true"
                      className="safe-bg bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.06),_transparent_20%)]"
                    />
                    <div className="relative z-10 space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">
                            Resumo operacional
                          </p>
                          <h2 className="mt-2 text-2xl font-bold tracking-tight">Leitura institucional rapida</h2>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-sky-200">
                          <Sparkles className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-sm font-medium text-slate-300">Total</p>
                          <p className="mt-2 text-3xl font-black tracking-tight text-white">{pagination.totalItems}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-sm font-medium text-slate-300">No mapa</p>
                          <p className="mt-2 text-3xl font-black tracking-tight text-white">{reportsWithCoordinates}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                          <p className="text-sm font-medium text-slate-300">Sem coordenadas</p>
                          <p className="mt-2 text-3xl font-black tracking-tight text-white">
                            {reportsWithoutCoordinates.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <FilterBar>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <SlidersHorizontal className="h-4 w-4 text-sky-700" />
                      Filtros por status, prioridade, categoria e territorio
                    </div>
                    <ReportsFilters
                      category={category}
                      neighborhood={neighborhood}
                      priority={priority}
                      query={query}
                      status={status}
                    />
                  </div>
                </FilterBar>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      <SectionContainer className="space-y-4">
        <AdBannerSlot position="portal_between_sections" />
      </SectionContainer>

      <SectionContainer className="ds-section grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
        <section className="space-y-5 reveal-up stagger-1">
          <SectionHeader
            eyebrow="Mapa territorial"
            description="Visualizacao territorial dos registros comunitarios com georreferenciamento disponivel."
            title="Mapa publico das demandas"
          />
          <ReportsMapSection reports={mapItems} />
        </section>

        <div className="space-y-4 reveal-up stagger-2">
          <Card className="border-slate-200 bg-white">
            <CardContent className="space-y-4 p-6">
              <Badge variant="muted">Leitura institucional</Badge>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                  Indicadores publicos para acompanhamento territorial
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  Os filtros e o mapa apoiam a leitura de prioridades, distribuicao territorial e
                  volume de registros publicados.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                    <SearchCheck className="h-4 w-4 text-sky-700" />
                    Filtros institucionais
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    Ajuste categoria, status, prioridade e bairro para consolidar a leitura operacional.
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                    <MapPinned className="h-4 w-4 text-emerald-700" />
                    Cobertura territorial
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {reportsWithCoordinates} itens desta pagina ja aparecem georreferenciados no mapa publico.
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                    <TriangleAlert className="h-4 w-4 text-amber-700" />
                    Prioridade urgente
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {urgentReports} registros nesta pagina estao marcados com prioridade urgente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-200/90">
            <CardContent className="space-y-4 p-6">
              <Badge variant="muted">Sem coordenadas</Badge>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                Registros que dependem de localizacao mais precisa
              </h3>
              {reportsWithoutCoordinates.length > 0 ? (
                <div className="grid gap-3">
                  {reportsWithoutCoordinates.slice(0, 5).map((report) => (
                    <div key={report.id} className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                      <p className="font-semibold text-slate-950">{report.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {report.address || report.neighborhood || "Localizacao ainda nao detalhada."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                  Todos os itens desta pagina contam com localizacao e ja aparecem no mapa publico.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-soft shadow-slate-200/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <ClipboardList className="mt-0.5 h-5 w-5 text-sky-700" />
            <div>
              <p className="font-semibold text-slate-950">Lista publica de demandas</p>
              <p className="text-sm leading-6 text-slate-700">
                Pagina {pagination.page} de {pagination.totalPages} com {pagination.totalItems} registros publicados.
              </p>
            </div>
          </div>
          <PaginationLinks page={pagination.page} totalPages={pagination.totalPages} />
        </div>

        {reports.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Link className={buttonVariants({ variant: "secondary" })} href="/report">
                Registrar demanda
              </Link>
            }
            description="Os registros comunitarios serao listados conforme novas solicitacoes forem recebidas."
            title="Nenhuma demanda registrada."
          />
        )}

        <div className="pb-2" />
      </SectionContainer>

      <SectionContainer className="space-y-4">
        <AdBannerSlot legacyPlacement={AdPlacement.REPORTS_BOTTOM} position="portal_footer" />
      </SectionContainer>
    </PageContainer>
  );
}
