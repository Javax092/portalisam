import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ReportDetailManager } from "@/components/admin/report-detail-manager";
import { getAdminReportById, getAssignableUsers } from "@/lib/admin-data";

type AdminReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminReportDetailPage({ params }: AdminReportDetailPageProps) {
  const { id } = await params;
  const [report, assignableUsers] = await Promise.all([getAdminReportById(id), getAssignableUsers()]);

  if (!report) {
    notFound();
  }

  return (
    <AdminPageShell
      eyebrow="Detalhe da demanda"
      title="Acompanhamento institucional da demanda"
      description="Consulta completa do registro comunitario com atualizacao operacional, historico e comunicacoes associadas."
    >
      <ReportDetailManager
        assignableUsers={assignableUsers}
        report={{
          ...report,
          latitude: report.latitude ? report.latitude.toString() : null,
          longitude: report.longitude ? report.longitude.toString() : null,
        }}
      />
    </AdminPageShell>
  );
}
