import Link from "next/link";
import {
  BellRing,
  CalendarPlus,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LayoutTemplate,
  Megaphone,
  MoveRight,
  Plus,
  Radar,
  Users2,
} from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { AdminMetricCard } from "@/components/ui/admin-metric-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatDate,
  getPriorityTone,
  getReportStatusTone,
  reportPriorityLabels,
  reportStatusLabels,
} from "@/lib/community";

type AdminDashboardProps = {
  data: Awaited<ReturnType<typeof import("@/lib/admin-data").getAdminDashboardData>>;
};

export function AdminDashboard({ data }: AdminDashboardProps) {
  const attentionReports = data.recentReports.filter((report) => report.status !== "RESOLVED").slice(0, 4);
  const statCards = [
    {
      label: "Comunicados publicados",
      value: data.totals.notices,
      helper: "publicacoes oficiais ativas no portal",
      icon: BellRing,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Eventos cadastrados",
      value: data.totals.events,
      helper: "agenda institucional e programacao publica",
      icon: CalendarRange,
      tone: "bg-slate-50 text-slate-700",
    },
    {
      label: "Demandas recebidas",
      value: data.totals.reports,
      helper: "volume total recebido pela operacao",
      icon: ClipboardList,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Demandas em acompanhamento",
      value: data.totals.openReports,
      helper: "casos que exigem leitura ou atualizacao",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Demandas resolvidas",
      value: data.totals.resolvedReports,
      helper: "casos finalizados com retorno registrado",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Patrocinadores ativos",
      value: data.totals.activeSponsors,
      helper: "apoiadores habilitados para campanhas",
      icon: Users2,
      tone: "bg-slate-50 text-slate-700",
    },
    {
      label: "Campanhas ativas",
      value: data.totals.activeCampaigns,
      helper: "banners vigentes na area publica",
      icon: Megaphone,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Espacos disponiveis",
      value: data.totals.availableAdSlots,
      helper: "placements ativos sem campanha vigente",
      icon: LayoutTemplate,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="reveal-up safe-section overflow-hidden safe-dark-card">
          <CardContent className="p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="safe-bg bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.06),_transparent_20%)]"
            />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/10 bg-slate-900 text-white" variant="muted">
                  Painel institucional
                </Badge>
                <Badge className="border-emerald-800 bg-emerald-900 text-emerald-100">
                  <Radar className="h-3.5 w-3.5" />
                  Leitura executiva
                </Badge>
              </div>

              <div className="space-y-3">
                <h2 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Gestao institucional com foco em acompanhamento, publicacoes e operacao territorial.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  O painel consolida indicadores operacionais, prioridades de atendimento e atalhos
                  para atualizacao do portal oficial.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                  <p className="text-sm font-medium text-slate-300">Demandas em acompanhamento</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-white">{data.totals.openReports}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                  <p className="text-sm font-medium text-slate-300">Demandas resolvidas</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-white">{data.totals.resolvedReports}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
                  <p className="text-sm font-medium text-slate-300">Publicacoes ativas</p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-white">
                    {data.totals.notices + data.totals.events}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="reveal-up stagger-1 border-slate-200 bg-white">
          <CardHeader className="pb-0">
            <CardTitle>Acoes administrativas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            <Link className={buttonVariants({ className: "justify-between", size: "lg" })} href="/admin/notices">
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo comunicado
              </span>
              <MoveRight className="h-4 w-4" />
            </Link>
            <Link
              className={buttonVariants({ className: "justify-between", size: "lg", variant: "secondary" })}
              href="/admin/events"
            >
              <span className="inline-flex items-center gap-2">
                <CalendarPlus className="h-4 w-4" />
                Novo evento
              </span>
              <MoveRight className="h-4 w-4" />
            </Link>
            <Link
              className={buttonVariants({ className: "justify-between", size: "lg", variant: "secondary" })}
              href="/admin/reports"
            >
              <span className="inline-flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Gerenciar demandas
              </span>
              <MoveRight className="h-4 w-4" />
            </Link>
            <Link
              className={buttonVariants({ className: "justify-between", size: "lg", variant: "secondary" })}
              href="/admin/sponsors"
            >
              <span className="inline-flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Gerenciar patrocinadores
              </span>
              <MoveRight className="h-4 w-4" />
            </Link>
            <LogoutButton className="justify-between" size="lg" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {statCards.map((item) => (
          <AdminMetricCard
            key={item.label}
            description={item.helper}
            icon={item.icon}
            title={item.label}
            toneClassName={item.tone}
            value={item.value}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="glass-panel border-slate-200/90">
          <CardHeader>
            <CardTitle>Demandas em acompanhamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {attentionReports.length > 0 ? (
              attentionReports.map((report) => (
                <div key={report.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <StatusBadge
                      label={reportStatusLabels[report.status]}
                      tone={getReportStatusTone(report.status)}
                    />
                    <PriorityBadge
                      label={reportPriorityLabels[report.priority]}
                      tone={getPriorityTone(report.priority)}
                    />
                  </div>
                  <p className="font-semibold text-slate-950">{report.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {report.neighborhood || report.address || "Localizacao ainda nao informada"}
                  </p>
                  <Link
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
                    href={`/admin/reports/${report.id}`}
                  >
                    Atualizar status
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState
                description="Os dados operacionais serao exibidos conforme os registros forem cadastrados."
                title="Nenhuma demanda recebida."
              />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="glass-panel border-slate-200/90">
            <CardHeader className="pb-0">
              <CardTitle>Comunicados publicados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {data.recentNotices.length > 0 ? (
                data.recentNotices.slice(0, 3).map((notice) => (
                  <div key={notice.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant="muted">{notice.category}</Badge>
                      {notice.isFeatured ? <Badge>Em destaque</Badge> : null}
                    </div>
                    <p className="font-semibold text-slate-950">{notice.title}</p>
                    <p className="mt-1 text-sm text-slate-600">Atualizado em {formatDate(notice.updatedAt)}</p>
                  </div>
                ))
              ) : (
                <EmptyState
                  className="rounded-[1.5rem] p-5 text-left shadow-none"
                  description="Os dados operacionais serao exibidos conforme os registros forem cadastrados."
                  title="Nenhum comunicado publicado."
                />
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-200/90">
            <CardHeader className="pb-0">
              <CardTitle>Agenda institucional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {data.recentEvents.length > 0 ? (
                data.recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                    <p className="font-semibold text-slate-950">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatDate(event.startsAt, {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState
                  className="rounded-[1.5rem] p-5 text-left shadow-none"
                  description="Os dados operacionais serao exibidos conforme os registros forem cadastrados."
                  title="Nenhum evento cadastrado."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-panel border-slate-200/90">
        <CardContent className="space-y-4 p-6">
          <SectionHeader
            eyebrow="Leitura operacional"
            title="Indicadores institucionais consolidados"
            description="Metricas resumidas, status visuais, cards claros e acessos administrativos mantem a operacao comunitaria organizada."
          />
          <p className="text-sm leading-6 text-slate-700">
            O painel permanece orientado por dados reais do portal e inicia com metricas zeradas
            quando nao houver registros cadastrados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
