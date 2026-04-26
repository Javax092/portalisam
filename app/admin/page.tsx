import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminDashboardData } from "@/lib/admin-data";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <AdminPageShell
      eyebrow="Dashboard"
      title="Visao geral da operacao comunitaria"
      description="Acompanhe rapidamente o volume de avisos, eventos e ocorrencias para manter a gestao local em movimento."
    >
      <AdminDashboard data={data} />
    </AdminPageShell>
  );
}
