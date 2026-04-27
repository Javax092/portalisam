import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminDashboardData } from "@/lib/admin-data";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <AdminPageShell
      eyebrow="Painel administrativo"
      title="Painel administrativo institucional"
      description="Gestao de comunicados, agenda, demandas e indicadores operacionais do ISAM Conectado."
    >
      <AdminDashboard data={data} />
    </AdminPageShell>
  );
}
