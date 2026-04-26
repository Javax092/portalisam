import Link from "next/link";
import {
  BellRing,
  CalendarPlus,
  CalendarRange,
  ClipboardList,
  CircleCheckBig,
  Clock3,
  MoveRight,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { AdminMetricCard } from "@/components/ui/admin-metric-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      label: "Demandas abertas",
      value: data.totals.openReports,
      helper: "Itens que precisam de leitura ou andamento",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Demandas registradas",
      value: data.totals.reports,
      helper: "Volume total recebido do territorio",
      icon: ClipboardList,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Resolvidas",
      value: data.totals.resolvedReports,
      helper: "Casos com resolucao registrada",
      icon: CircleCheckBig,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Avisos",
      value: data.totals.notices,
      helper: "Comunicados publicados para o portal",
      icon: BellRing,
      tone: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Eventos",
      value: data.totals.events,
      helper: "Acoes e encontros cadastrados",
      icon: CalendarRange,
      tone: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white text-slate-900">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <Badge variant="default">
              Operacao em tempo real
            </Badge>
            <div className="space-y-3">
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Foque no que precisa de decisao agora.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                O painel prioriza demandas abertas, ultimas atividades e atalhos de comunicacao
                para reduzir tempo de gestao.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Abertas</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">{data.totals.openReports}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Resolvidas</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">{data.totals.resolvedReports}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Conteudos</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">{data.totals.notices + data.totals.events}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Acoes rapidas</CardTitle>
                <CardDescription>Atalhos com contraste forte para manter o portal atualizado.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link className={buttonVariants({ className: "justify-between", size: "lg" })} href="/admin/notices">
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo aviso
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
                Ver demandas
              </span>
              <MoveRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-3xl border-slate-200 bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Precisa de atencao</CardTitle>
                <CardDescription>Demandas recentes abertas ou em andamento.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {attentionReports.length > 0 ? (
              attentionReports.map((report) => (
                <div key={report.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm shadow-slate-200/60">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <StatusBadge
                      label={reportStatusLabels[report.status]}
                      tone={getReportStatusTone(report.status)}
                    />
                    <StatusBadge
                      label={reportPriorityLabels[report.priority]}
                      tone={getPriorityTone(report.priority)}
                    />
                  </div>
                  <p className="font-semibold text-slate-900">{report.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {report.neighborhood || report.address || "Local ainda nao informado"}
                  </p>
                  <Link
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
                    href={`/admin/reports/${report.id}`}
                  >
                    Resolver detalhe
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <EmptyState
                description="Quando houver demandas abertas, elas aparecem aqui para acelerar a triagem."
                title="Nenhuma demanda exigindo atencao"
              />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ultimos avisos</CardTitle>
              <CardDescription>O que esta no portal publico neste momento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentNotices.length > 0 ? (
                data.recentNotices.slice(0, 3).map((notice) => (
                  <div key={notice.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge>{notice.category}</Badge>
                      {notice.isFeatured ? <StatusBadge label="Destaque" tone="urgent" /> : null}
                    </div>
                    <p className="font-semibold text-slate-900">{notice.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Atualizado em {formatDate(notice.updatedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Nenhum aviso cadastrado ainda.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proximos eventos</CardTitle>
              <CardDescription>Agenda operacional da comunidade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentEvents.length > 0 ? (
                data.recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{event.title}</p>
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
                <p className="text-sm leading-6 text-slate-600">
                  Nenhum evento cadastrado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-dashed border-sky-200 bg-gradient-to-r from-sky-50 to-emerald-50">
        <CardContent className="space-y-4 p-6">
          <SectionHeader
            eyebrow="UX simples"
            title="Atalhos e leitura pensados para quem não é técnico"
            description="Métricas resumidas, status visuais, blocos claros e ações rápidas ajudam a equipe local a operar o portal com menos esforço."
          />
          <p className="text-sm leading-6 text-slate-600">
            Os dados continuam vindo da base real e o painel foi ajustado apenas na camada visual para melhorar leitura e tomada de decisao.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
