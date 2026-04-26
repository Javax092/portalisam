import { ReportActivityType, ReportStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getPriorityFromSeverity } from "@/lib/community";
import { prisma } from "@/lib/db/prisma";
import { getPublicReports } from "@/lib/public-data";
import { getReportSlaWindow } from "@/lib/reports";
import { publicReportFiltersSchema } from "@/lib/validations/report-filters";
import { publicCreateReportSchema } from "@/lib/validations/report";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = publicReportFiltersSchema.safeParse({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    neighborhood: searchParams.get("neighborhood") || "",
    page: searchParams.get("page") || "1",
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Filtros invalidos." }, { status: 400 });
  }

  const result = await getPublicReports(parsed.data);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = publicCreateReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Nao foi possivel registrar a demanda." },
      { status: 400 },
    );
  }

  const priority = getPriorityFromSeverity(parsed.data.severity);
  const createdAt = new Date();
  const slaWindow = getReportSlaWindow(ReportStatus.OPEN, priority, createdAt);
  const report = await prisma.$transaction(async (tx) => {
    const createdReport = await tx.report.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        severity: parsed.data.severity,
        priority,
        status: ReportStatus.OPEN,
        address: parsed.data.address || null,
        neighborhood: parsed.data.neighborhood || null,
        submittedByName: parsed.data.submittedByName || null,
        submittedByEmail: parsed.data.submittedByEmail || null,
        submittedByPhone: parsed.data.submittedByPhone || null,
        allowEmailUpdates: parsed.data.allowEmailUpdates,
        allowWhatsappUpdates: parsed.data.allowWhatsappUpdates,
        firstResponseDueAt: slaWindow.firstResponseDueAt,
        resolutionDueAt: slaWindow.resolutionDueAt,
        relevantUpdatedAt: createdAt,
        lastStatusChangedAt: createdAt,
        lastActivityAt: createdAt,
        latitude: parsed.data.latitude !== undefined ? parsed.data.latitude.toString() : undefined,
        longitude: parsed.data.longitude !== undefined ? parsed.data.longitude.toString() : undefined,
        imageUrl: parsed.data.imageUrl || null,
      },
    });

    await tx.reportActivity.create({
      data: {
        reportId: createdReport.id,
        type: ReportActivityType.CREATED,
        message: "Ocorrencia criada pelo portal publico.",
      },
    });

    return createdReport;
  });

  return NextResponse.json(
    { message: "Demanda registrada com sucesso.", reportId: report.id },
    { status: 201 },
  );
}
