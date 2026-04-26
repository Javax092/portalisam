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
      eyebrow="Detalhe da ocorrencia"
      title="Acompanhar e atualizar demanda"
      description="Veja todos os dados da ocorrencia e registre o andamento mais recente para a equipe e para a comunidade."
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
