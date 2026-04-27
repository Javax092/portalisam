import { ArrowUpRight, Clock3, MapPin, MessageSquareText, ShieldAlert, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatDate,
  getPriorityTone,
  getReportStatusTone,
  reportCategoryLabels,
  reportPriorityLabels,
  reportSeverityLabels,
  reportStatusLabels,
} from "@/lib/community";

type ReportCardProps = {
  report: {
    id: string;
    title: string;
    description: string;
    category: keyof typeof reportCategoryLabels & string;
    severity: keyof typeof reportSeverityLabels & string;
    status: keyof typeof reportStatusLabels & string;
    address: string | null;
    neighborhood: string | null;
    managerComment: string | null;
    createdAt: Date | string;
    updatedAt?: Date | string;
    relevantUpdatedAt?: Date | string;
  };
};

export function ReportCard({ report }: ReportCardProps) {
  const statusTone = getReportStatusTone(report.status);
  const priorityTone = getPriorityTone(report.severity);
  const location = [report.address, !report.address ? report.neighborhood : null].filter(Boolean).join(", ");
  const lastUpdated = report.relevantUpdatedAt || report.updatedAt || report.createdAt;
  const compactDescription =
    report.description.length > 180 ? `${report.description.slice(0, 177).trimEnd()}...` : report.description;
  const compactComment =
    report.managerComment && report.managerComment.length > 160
      ? `${report.managerComment.slice(0, 157).trimEnd()}...`
      : report.managerComment;

  return (
    <Card className="premium-card-hover h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge label={reportPriorityLabels[report.severity]} tone={priorityTone} />
          <StatusBadge label={reportStatusLabels[report.status]} tone={statusTone} />
          <Badge variant="muted">
            <Tag className="h-3.5 w-3.5" />
            {reportCategoryLabels[report.category]}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-balance text-[1.35rem] font-bold leading-tight tracking-tight text-slate-950 sm:text-2xl">
              {report.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">{compactDescription}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/90 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Localizacao
              </p>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                <span className="line-clamp-2">{location || "Local ainda nao informado"}</span>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/90 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Historico de acompanhamento
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div>Registrado em {formatDate(report.createdAt)}</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock3 className="h-4 w-4 shrink-0 text-slate-500" />
                  Atualizado em {formatDate(lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {compactComment ? (
          <div className="rounded-[1.25rem] border border-emerald-200/80 bg-emerald-50/75 p-4 text-sm leading-6 text-emerald-950">
            <div className="mb-2 flex items-center gap-2 font-medium text-emerald-950">
              <MessageSquareText className="h-4 w-4 text-emerald-600" />
              Atualizacao institucional
            </div>
            <p className="text-emerald-900/90">{compactComment}</p>
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Registro publicado para acompanhamento publico. Atualizacoes operacionais serao exibidas neste historico conforme a evolucao da demanda.
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 pt-1 text-sm text-slate-500">
          <span>Registro comunitario</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            Acompanhamento institucional
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
