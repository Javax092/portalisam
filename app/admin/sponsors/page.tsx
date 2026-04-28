import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { SponsorManager } from "@/components/admin/sponsor-manager";
import { getAdminSponsorsModuleData } from "@/lib/admin-data";

export default async function AdminSponsorsPage() {
  const data = await getAdminSponsorsModuleData();

  return (
    <AdminPageShell
      eyebrow="Patrocinadores"
      title="Patrocinadores e espacos publicitarios"
      description="Gestao institucional de apoiadores, espacos reservados e campanhas visuais com leitura discreta no portal publico."
    >
      <SponsorManager initialData={data} />
    </AdminPageShell>
  );
}
