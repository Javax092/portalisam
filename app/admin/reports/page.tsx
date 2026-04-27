import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ReportsTable } from "@/components/admin/reports-table";
import { getAdminReports, getAssignableUsers } from "@/lib/admin-data";
import { normalizePage } from "@/lib/reports";

type AdminReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  const resolved = await searchParams;
  const query = typeof resolved.query === "string" ? resolved.query : undefined;
  const status = typeof resolved.status === "string" ? resolved.status : undefined;
  const priority = typeof resolved.priority === "string" ? resolved.priority : undefined;
  const category = typeof resolved.category === "string" ? resolved.category : undefined;
  const assignedToUserId = typeof resolved.assignedToUserId === "string" ? resolved.assignedToUserId : undefined;
  const page = normalizePage(typeof resolved.page === "string" ? resolved.page : undefined);
  const [{ reports, pagination }, assignableUsers] = await Promise.all([
    getAdminReports({ query, status, priority, category, assignedToUserId, page }),
    getAssignableUsers(),
  ]);

  return (
    <AdminPageShell
      eyebrow="Demandas"
      title="Gestao institucional de demandas"
      description="Filtre, acompanhe prioridades e atualize o andamento de cada registro comunitario."
    >
      <ReportsTable
        assignableUsers={assignableUsers}
        assignedToUserId={assignedToUserId}
        category={category}
        pagination={pagination}
        priority={priority}
        query={query}
        reports={reports}
        status={status}
      />
    </AdminPageShell>
  );
}
