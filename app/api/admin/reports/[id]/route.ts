import { ReportActivityType, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/api";
import { prisma } from "@/lib/db/prisma";
import { getReportSlaWindow } from "@/lib/reports";
import { adminReportUpdateSchema } from "@/lib/validations/report";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ message: "Ocorrencia nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({ report });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await requireAdminApiSession(UserRole.MANAGER);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const parsed = adminReportUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Dados invalidos." }, { status: 400 });
  }

  const { id } = await params;
  const existingReport = await prisma.report.findUnique({ where: { id } });

  if (!existingReport) {
    return NextResponse.json({ message: "Ocorrencia nao encontrada." }, { status: 404 });
  }

  const nextManagerComment = parsed.data.managerComment || null;
  const nextAssignedToUserId = parsed.data.assignedToUserId || null;
  const internalComment = parsed.data.internalComment || null;
  const statusChanged = existingReport.status !== parsed.data.status;
  const priorityChanged = existingReport.priority !== parsed.data.priority;
  const assignmentChanged = existingReport.assignedToUserId !== nextAssignedToUserId;
  const publicUpdateChanged = existingReport.managerComment !== nextManagerComment;
  const closingStatuses = new Set(["RESOLVED", "ARCHIVED"]);
  const slaWindow = getReportSlaWindow(parsed.data.status, parsed.data.priority, existingReport.createdAt);

  const report = await prisma.$transaction(async (tx) => {
    const updatedReport = await tx.report.update({
      where: { id },
      data: {
        status: parsed.data.status,
        priority: parsed.data.priority,
        assignedToUserId: nextAssignedToUserId,
        managerComment: nextManagerComment,
        relevantUpdatedAt: new Date(),
        lastActivityAt: new Date(),
        lastStatusChangedAt: statusChanged ? new Date() : existingReport.lastStatusChangedAt,
        firstResponseDueAt: slaWindow.firstResponseDueAt,
        resolutionDueAt: slaWindow.resolutionDueAt,
        closedAt: closingStatuses.has(parsed.data.status) ? new Date() : null,
      },
    });

    const activities = [];

    if (statusChanged) {
      activities.push(
        tx.reportActivity.create({
          data: {
            reportId: id,
            actorUserId: session.userId,
            type: ReportActivityType.STATUS_CHANGED,
            fromStatus: existingReport.status,
            toStatus: parsed.data.status,
            message: `Status alterado para ${parsed.data.status}.`,
          },
        }),
      );
    }

    if (priorityChanged) {
      activities.push(
        tx.reportActivity.create({
          data: {
            reportId: id,
            actorUserId: session.userId,
            type: ReportActivityType.PRIORITY_CHANGED,
            message: `Prioridade alterada para ${parsed.data.priority}.`,
          },
        }),
      );
    }

    if (assignmentChanged) {
      activities.push(
        tx.reportActivity.create({
          data: {
            reportId: id,
            actorUserId: session.userId,
            type: nextAssignedToUserId ? ReportActivityType.ASSIGNED : ReportActivityType.UNASSIGNED,
            message: nextAssignedToUserId ? "Responsavel definido para a demanda." : "Responsavel removido da demanda.",
          },
        }),
      );
    }

    if (publicUpdateChanged && nextManagerComment) {
      activities.push(
        tx.reportComment.create({
          data: {
            reportId: id,
            authorUserId: session.userId,
            body: nextManagerComment,
            isInternal: false,
          },
        }),
      );
      activities.push(
        tx.reportActivity.create({
          data: {
            reportId: id,
            actorUserId: session.userId,
            type: ReportActivityType.PUBLIC_UPDATE_EDITED,
            message: "Atualizacao publica revisada.",
          },
        }),
      );
    }

    if (internalComment) {
      activities.push(
        tx.reportComment.create({
          data: {
            reportId: id,
            authorUserId: session.userId,
            body: internalComment,
            isInternal: true,
          },
        }),
      );
      activities.push(
        tx.reportActivity.create({
          data: {
            reportId: id,
            actorUserId: session.userId,
            type: ReportActivityType.INTERNAL_NOTE_ADDED,
            message: internalComment,
          },
        }),
      );
    }

    const notifications = [];

    if (publicUpdateChanged && nextManagerComment) {
      if (updatedReport.allowEmailUpdates && updatedReport.submittedByEmail) {
        notifications.push(
          tx.notificationDelivery.create({
            data: {
              reportId: id,
              organizationId: updatedReport.organizationId,
              channel: "EMAIL",
              recipient: updatedReport.submittedByEmail,
              templateKey: "report-status-update",
              payload: {
                status: updatedReport.status,
                title: updatedReport.title,
              },
            },
          }),
        );
        activities.push(
          tx.reportActivity.create({
            data: {
              reportId: id,
              actorUserId: session.userId,
              type: ReportActivityType.NOTIFICATION_QUEUED,
              message: "Atualizacao pronta para envio por email.",
            },
          }),
        );
      }

      if (updatedReport.allowWhatsappUpdates && updatedReport.submittedByPhone) {
        notifications.push(
          tx.notificationDelivery.create({
            data: {
              reportId: id,
              organizationId: updatedReport.organizationId,
              channel: "WHATSAPP",
              recipient: updatedReport.submittedByPhone,
              templateKey: "report-status-update",
              payload: {
                status: updatedReport.status,
                title: updatedReport.title,
              },
            },
          }),
        );
        activities.push(
          tx.reportActivity.create({
            data: {
              reportId: id,
              actorUserId: session.userId,
              type: ReportActivityType.NOTIFICATION_QUEUED,
              message: "Atualizacao pronta para envio por WhatsApp.",
            },
          }),
        );
      }
    }

    await Promise.all([...activities, ...notifications]);

    return updatedReport;
  });

  return NextResponse.json({ message: "Ocorrencia atualizada com sucesso.", report });
}
