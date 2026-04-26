"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Save,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { getRoleLabel } from "@/lib/auth/roles";
import {
  formatDate,
  getPriorityTone,
  getReportStatusTone,
  reportCategoryLabels,
  reportPriorityLabels,
  reportSeverityLabels,
  reportStatusLabels,
} from "@/lib/community";
import { getReportActivityLabel } from "@/lib/reports";
import { adminReportUpdateSchema, type AdminReportUpdateInput } from "@/lib/validations/report";

type UserRoleValue = "ADMIN" | "ASSISTANT";

type ReportDetailManagerProps = {
  assignableUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: UserRoleValue;
  }>;
  report: {
    id: string;
    title: string;
    description: string;
    category: keyof typeof reportCategoryLabels;
    severity: keyof typeof reportSeverityLabels;
    status: keyof typeof reportStatusLabels;
    priority: keyof typeof reportPriorityLabels;
    address: string | null;
    neighborhood: string | null;
    latitude: string | number | null;
    longitude: string | number | null;
    imageUrl: string | null;
    managerComment: string | null;
    submittedByName: string | null;
    submittedByEmail: string | null;
    submittedByPhone: string | null;
    allowEmailUpdates: boolean;
    allowWhatsappUpdates: boolean;
    relevantUpdatedAt: string | Date;
    lastActivityAt: string | Date;
    firstResponseDueAt: string | Date | null;
    resolutionDueAt: string | Date | null;
    closedAt: string | Date | null;
    assignedToUserId: string | null;
    assignedTo: {
      id: string;
      name: string | null;
      email: string;
      role: UserRoleValue;
    } | null;
    organization: {
      id: string;
      name: string;
      slug: string;
    } | null;
    community: {
      id: string;
      name: string;
      slug: string;
    } | null;
    comments: Array<{
      id: string;
      body: string;
      isInternal: boolean;
      createdAt: string | Date;
      authorName: string | null;
      authorUser: {
        name: string | null;
        email: string;
        role: UserRoleValue;
      } | null;
    }>;
    activities: Array<{
      id: string;
      type: Parameters<typeof getReportActivityLabel>[0];
      message: string | null;
      fromStatus: keyof typeof reportStatusLabels | null;
      toStatus: keyof typeof reportStatusLabels | null;
      createdAt: string | Date;
      actorUser: {
        name: string | null;
        email: string;
        role: UserRoleValue;
      } | null;
    }>;
    notifications: Array<{
      id: string;
      channel: string;
      status: string;
      recipient: string;
      createdAt: string | Date;
      sentAt: string | Date | null;
    }>;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
};

export function ReportDetailManager({ report, assignableUsers }: ReportDetailManagerProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminReportUpdateInput>({
    resolver: zodResolver(adminReportUpdateSchema),
    defaultValues: {
      status: report.status,
      priority: report.priority,
      assignedToUserId: report.assignedToUserId || "",
      managerComment: report.managerComment || "",
      internalComment: "",
    },
  });

  const publicComments = report.comments.filter((comment) => !comment.isInternal);
  const internalComments = report.comments.filter((comment) => comment.isInternal);

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    const response = await fetch(`/api/admin/reports/${report.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (response.ok) {
      setMessage({ type: "success", text: data?.message ?? "Atualizacao salva com sucesso." });
      router.refresh();
      return;
    }

    setMessage({
      type: "error",
      text: data?.message ?? "Nao foi possivel salvar a atualizacao agora.",
    });
  });

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-200 bg-white text-slate-900">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-start sm:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="muted">
                {reportCategoryLabels[report.category]}
              </Badge>
              <StatusBadge label={reportStatusLabels[report.status]} tone={getReportStatusTone(report.status)} />
              <StatusBadge label={reportPriorityLabels[report.priority]} tone={getPriorityTone(report.priority)} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{report.title}</h2>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{report.description}</p>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:min-w-[300px]">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-slate-500" />
              <span>{report.assignedTo ? report.assignedTo.name || report.assignedTo.email : "Sem responsavel"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>{report.address || report.neighborhood || "Local nao informado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-slate-500" />
              <span>Ultima atividade: {formatDate(report.lastActivityAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo operacional</CardTitle>
              <CardDescription>Dados essenciais para decidir o proximo passo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock label="Gravidade" value={reportSeverityLabels[report.severity]} />
                <InfoBlock label="Status" value={reportStatusLabels[report.status]} />
                <InfoBlock label="Endereco" value={report.address || "Nao informado"} />
                <InfoBlock label="Bairro" value={report.neighborhood || "Nao informado"} />
                <InfoBlock label="Organizacao" value={report.organization?.name || "Base padrao"} />
                <InfoBlock label="Comunidade" value={report.community?.name || "Nao vinculada"} />
                <InfoBlock label="Criado em" value={formatDate(report.createdAt, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
                <InfoBlock label="SLA resolucao" value={report.resolutionDueAt ? formatDate(report.resolutionDueAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Nao aplicavel"} />
              </div>
              {report.imageUrl ? (
                <div className="rounded-lg bg-sky-50 p-4">
                  <p className="font-semibold text-foreground">Imagem informada</p>
                  <a className="text-sm font-medium text-sky-700 underline" href={report.imageUrl} rel="noreferrer" target="_blank">
                    Abrir imagem enviada
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato do morador</CardTitle>
              <CardDescription>Informacoes opcionais enviadas no formulario publico.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <InfoBlock label="Nome" value={report.submittedByName || "Nao informado"} />
              <InfoBlock label="E-mail" value={report.submittedByEmail || "Nao informado"} />
              <InfoBlock label="WhatsApp" value={report.submittedByPhone || "Nao informado"} />
              <InfoBlock label="Aceita e-mail" value={report.allowEmailUpdates ? "Sim" : "Nao"} />
              <InfoBlock label="Aceita WhatsApp" value={report.allowWhatsappUpdates ? "Sim" : "Nao"} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atualizar andamento</CardTitle>
            <CardDescription>
              Separe o que sera publico para a comunidade do que e nota interna da equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField error={errors.status?.message} label="Status">
                  <Select {...register("status")}>
                    <option value="OPEN">Novo</option>
                    <option value="IN_REVIEW">Em analise</option>
                    <option value="IN_PROGRESS">Em andamento</option>
                    <option value="RESOLVED">Resolvido</option>
                    <option value="ARCHIVED">Arquivado</option>
                  </Select>
                </FormField>
                <FormField error={errors.priority?.message} label="Prioridade">
                  <Select {...register("priority")}>
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </Select>
                </FormField>
                <FormField error={errors.assignedToUserId?.message} label="Responsavel">
                  <Select {...register("assignedToUserId")}>
                    <option value="">Sem responsavel</option>
                    {assignableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email} ({getRoleLabel(user.role)})
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <FormField
                  error={errors.managerComment?.message}
                  hint="Aparece no acompanhamento publico. Use linguagem simples e objetiva."
                  label="Comentario publico"
                >
                  <Textarea
                    {...register("managerComment")}
                    placeholder="Ex.: A demanda foi encaminhada para avaliacao da equipe local."
                  />
                </FormField>
                <FormField
                  error={errors.internalComment?.message}
                  hint="Fica na timeline interna para contexto operacional."
                  label="Nota interna"
                >
                  <Textarea
                    {...register("internalComment")}
                    placeholder="Ex.: Aguardando retorno do parceiro responsavel pela execucao."
                  />
                </FormField>
              </div>

              {message ? <Toast message={message.text} type={message.type} /> : null}
              <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar atualizacao
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Timeline operacional</CardTitle>
            <CardDescription>Historico de mudancas e encaminhamentos da demanda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.activities.length > 0 ? (
              report.activities.map((activity) => (
                <div key={activity.id} className="relative rounded-lg border border-border/70 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-foreground">{getReportActivityLabel(activity.type)}</p>
                  <p className="mt-1 leading-6">{activity.message || "Sem mensagem adicional."}</p>
                  {activity.fromStatus && activity.toStatus ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {reportStatusLabels[activity.fromStatus]} para {reportStatusLabels[activity.toStatus]}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {activity.actorUser ? activity.actorUser.name || activity.actorUser.email : "Sistema"} em{" "}
                    {formatDate(activity.createdAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-emerald-700" />
                <CardTitle>Comentarios publicos</CardTitle>
              </div>
              <CardDescription>Informacoes que ajudam a comunidade a acompanhar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {publicComments.length > 0 ? (
                publicComments.map((comment) => (
                  <CommentBlock key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum comentario publico registrado.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                <CardTitle>Notas internas</CardTitle>
              </div>
              <CardDescription>Contexto reservado para a equipe gestora.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {internalComments.length > 0 ? (
                internalComments.map((comment) => (
                  <CommentBlock key={comment.id} comment={comment} internal />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma nota interna registrada.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-sky-700" />
                <CardTitle>Fila de notificacoes</CardTitle>
              </div>
              <CardDescription>Preparos de contato e status de envio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.notifications.length > 0 ? (
                report.notifications.map((notification) => (
                  <div key={notification.id} className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-foreground">{notification.channel}</p>
                    <p>Status: {notification.status}</p>
                    <p>Destino: {notification.recipient}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Criada em {formatDate(notification.createdAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma notificacao preparada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}

type CommentBlockProps = {
  comment: {
    body: string;
    createdAt: string | Date;
    authorName: string | null;
    authorUser: {
      name: string | null;
      email: string;
      role: UserRoleValue;
    } | null;
  };
  internal?: boolean;
};

function CommentBlock({ comment, internal = false }: CommentBlockProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
      <div className="mb-2 flex flex-wrap gap-2">
        {internal ? (
          <Badge variant="muted">Interno</Badge>
        ) : (
          <Badge variant="success">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Publico
          </Badge>
        )}
      </div>
      <p className="leading-6">{comment.body}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {comment.authorUser?.name || comment.authorUser?.email || comment.authorName || "Equipe"} em{" "}
        {formatDate(comment.createdAt, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
