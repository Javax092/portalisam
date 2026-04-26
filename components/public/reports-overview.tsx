import Link from "next/link";
import {
  ArrowRight,
  CircleDashed,
  ClipboardList,
  Eye,
  ListFilter,
  MapPinned,
  MoveRight,
  Radar,
  SlidersHorizontal,
} from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { ReportCard } from "@/components/public/report-card";
import { ReportsFilters } from "@/components/public/reports-filters";
import { ReportsMapSection } from "@/components/public/reports-map-section";
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
    <main className="pb-24">
      <section className="relative overflow-hidden bg-hero-grid pb-10 pt-8 sm:pb-14 sm:pt-12">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <SectionContainer className="relative space-y-8">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <Card className="surface-highlight overflow-hidden rounded-[2rem] border-slate-200">
              <CardContent className="space-y-6 p-6 pt-6 sm:p-8 sm:pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">Demandas da comunidade</Badge>
                  <Badge className="border-slate-200 bg-white/80 text-slate-700">
                    <Radar className="h-3.5 w-3.5 text-sky-700" />
                    Feed publico em tempo real
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[3.25rem]">
                    Acompanhe as demandas com leitura rapida, status visivel e mapa em destaque.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                    Um painel publico mais claro para entender o que entrou, o que esta em analise,
                    o que esta em andamento e o que ja foi resolvido.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link className={buttonVariants({ size: "lg" })} href="/report">
                    Registrar nova demanda
                    <MoveRight className="h-4 w-4" />
                  </Link>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
                    <Eye className="h-4 w-4 text-sky-700" />
                    {pagination.totalItems} registros encontrados com os filtros atuais
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-[2rem] border-slate-200 bg-slate-950 text-white">
              <CardContent className="space-y-5 p-6 pt-6 sm:p-7 sm:pt-7">
                <div className="space-y-2">
                  <Badge className="border-white/10 bg-white/10 text-white">Resumo executivo</Badge>
                  <h2 className="text-2xl font-semibold tracking-tight">Leitura rapida desta pagina</h2>
                  <p className="text-sm leading-6 text-slate-300">
                    Numeros principais para orientar triagem, acompanhamento territorial e qualidade da localizacao.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-slate-300">Total</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{pagination.totalItems}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-sm font-medium text-emerald-100">No mapa</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">{reportsWithCoordinates}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-amber-400/20 bg-amber-400/10 p-4">
                    <p className="text-sm font-medium text-amber-100">Sem coordenadas</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white">{reportsWithoutCoordinates.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              helper="registros encontrados com os filtros atuais"
              icon={ClipboardList}
              label="Total de demandas"
              tone="sky"
              value={pagination.totalItems}
            />
            <StatCard
              helper="itens posicionados no mapa publico"
              icon={MapPinned}
              label="No mapa"
              tone="emerald"
              value={reportsWithCoordinates}
            />
            <StatCard
              helper="casos com prioridade maxima nesta pagina"
              icon={CircleDashed}
              label="Urgentes"
              tone="amber"
              value={urgentReports}
            />
          </div>

          <Card className="surface-highlight">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <SlidersHorizontal className="h-4 w-4 text-sky-700" />
                Filtros por status, prioridade visual e categoria
              </div>
              <ReportsFilters
                category={category}
                neighborhood={neighborhood}
                priority={priority}
                query={query}
                status={status}
              />
            </CardContent>
          </Card>
        </SectionContainer>
      </section>

      <SectionContainer className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Mapa das demandas"
            title="Visualize os pontos registrados no territorio"
            description="O mapa ganhou mais presenca, legenda clara e leitura territorial mais rapida."
          />
          <ReportsMapSection reports={mapItems} />
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-white via-white to-sky-50">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="space-y-2">
                <Badge variant="muted">Leitura rápida</Badge>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Resumo desta pagina</h3>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[1.25rem] bg-sky-50 p-4">
                  <p className="text-sm font-semibold text-sky-900">Total</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-sky-950">{pagination.totalItems}</p>
                </div>
                <div className="rounded-[1.25rem] bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-900">No mapa</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-950">{reportsWithCoordinates}</p>
                </div>
                <div className="rounded-[1.25rem] bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">Sem coordenadas</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-amber-950">{reportsWithoutCoordinates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-slate-500" />
                <h3 className="text-xl font-semibold tracking-tight text-foreground">Itens sem coordenadas</h3>
              </div>
              {reportsWithoutCoordinates.length > 0 ? (
                reportsWithoutCoordinates.slice(0, 6).map((report) => (
                  <div key={report.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-foreground">{report.title}</p>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {report.address || report.neighborhood || "Local ainda não detalhado."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                  Todos os itens desta página já contam com localização para leitura no mapa.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <div className="flex flex-col gap-3 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <ClipboardList className="mt-0.5 h-5 w-5 text-emerald-300" />
            <div>
              <p className="font-semibold">Feed publico de demandas</p>
              <p className="text-sm leading-6 text-slate-200">
                Pagina {pagination.page} de {pagination.totalPages} com {pagination.totalItems} registros encontrados.
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
                Registrar uma nova demanda
              </Link>
            }
            description="Nenhuma ocorrência foi encontrada com os filtros atuais. Ajuste a busca ou registre um novo relato."
            title="Nenhuma demanda encontrada"
          />
        )}
      </SectionContainer>
    </main>
  );
}
