import Link from "next/link";
import { Clock3, MapPin, MessageSquare, Search, UserRound } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { Input } from "@/components/ui/input";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableList, TableListRow } from "@/components/ui/table-list";
import {
  categoryOptions,
  formatDate,
  getPriorityTone,
  getReportStatusTone,
  priorityOptions,
  reportPriorityLabels,
  reportStatusLabels,
} from "@/lib/community";

type ReportItem = {
  id: string;
  title: string;
  category: string;
  neighborhood: string | null;
  address: string | null;
  status: keyof typeof reportStatusLabels;
  priority: keyof typeof reportPriorityLabels;
  createdAt: string | Date;
  lastActivityAt: string | Date;
  relevantUpdatedAt: string | Date;
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  _count: {
    comments: number;
    activities: number;
    notifications: number;
  };
};

type ReportsTableProps = {
  reports: ReportItem[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  query?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedToUserId?: string;
  assignableUsers: Array<{
    id: string;
    name: string | null;
    email: string;
  }>;
};

export function ReportsTable({
  reports,
  pagination,
  query = "",
  status = "",
  priority = "",
  category = "",
  assignedToUserId = "",
  assignableUsers,
}: ReportsTableProps) {
  return (
    <div className="space-y-5">
      <FilterBar>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Filtros do painel</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Localize registros por titulo, localizacao, categoria, status, prioridade ou responsavel.
              </p>
            </div>
          </div>

          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
            <Input defaultValue={query} name="query" placeholder="Buscar por titulo, localizacao ou responsavel" />
            <Select defaultValue={category} name="category">
              <option value="">Categorias</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue={status} name="status">
              <option value="">Status</option>
              <option value="OPEN">Novo</option>
              <option value="IN_REVIEW">Em analise</option>
              <option value="IN_PROGRESS">Em andamento</option>
              <option value="RESOLVED">Resolvido</option>
              <option value="ARCHIVED">Arquivado</option>
            </Select>
            <Select defaultValue={priority} name="priority">
              <option value="">Prioridade</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select defaultValue={assignedToUserId} name="assignedToUserId">
              <option value="">Responsavel</option>
              {assignableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </Select>
            <Button className="w-full md:col-span-2 xl:col-span-1" type="submit" variant="secondary">
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
          </form>
        </div>
      </FilterBar>

      <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 shadow-soft shadow-slate-200/70 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-600">
            <strong className="font-semibold text-slate-950">{pagination.totalItems}</strong> demandas encontradas
            com os filtros atuais.
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
            Pagina {pagination.page} de {pagination.totalPages}
          </p>
        </div>
        <PaginationLinks page={pagination.page} totalPages={pagination.totalPages} />
      </div>

      {reports.length > 0 ? (
        <TableList className="reveal-up">
          <div className="hidden grid-cols-[1.35fr_0.85fr_0.85fr_1fr_0.9fr_auto] gap-4 border-b border-slate-200/85 bg-slate-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 xl:grid">
            <span>Demanda</span>
            <span>Status</span>
            <span>Prioridade</span>
            <span>Responsavel</span>
            <span>Atividade</span>
            <span>Acoes</span>
          </div>
          {reports.map((report) => (
            <TableListRow
              key={report.id}
              className="md:grid-cols-[1fr_auto] xl:grid-cols-[1.35fr_0.85fr_0.85fr_1fr_0.9fr_auto] xl:items-center"
            >
              <div className="space-y-2">
                <Link
                  className="text-base font-semibold tracking-tight text-slate-950 hover:text-sky-700"
                  href={`/admin/reports/${report.id}`}
                >
                  {report.title}
                </Link>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {report.address || report.neighborhood || "Localizacao nao detalhada"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    Criado em {formatDate(report.createdAt)}
                  </span>
                </div>
              </div>

              <div>
                <StatusBadge label={reportStatusLabels[report.status]} tone={getReportStatusTone(report.status)} />
              </div>

              <div>
                <PriorityBadge
                  label={reportPriorityLabels[report.priority]}
                  tone={getPriorityTone(report.priority)}
                />
              </div>

              <div className="text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4 text-slate-500" />
                  {report.assignedTo ? report.assignedTo.name || report.assignedTo.email : "Nao definido"}
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-600">
                <p>{formatDate(report.relevantUpdatedAt)}</p>
                <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {report._count.comments} atualizacoes
                </p>
              </div>

              <div>
                <Link className={buttonVariants({ size: "sm" })} href={`/admin/reports/${report.id}`}>
                  Abrir
                </Link>
              </div>
            </TableListRow>
          ))}
        </TableList>
      ) : (
        <EmptyState
          description="Revise os filtros aplicados ou aguarde novos registros comunitarios no portal."
          title="Nenhuma demanda recebida."
        />
      )}
    </div>
  );
}
