import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { NoticeManager } from "@/components/admin/notice-manager";
import { getAdminNotices } from "@/lib/admin-data";

export default async function AdminNoticesPage() {
  const notices = await getAdminNotices();

  return (
    <AdminPageShell
      eyebrow="Comunicados"
      title="Publicacoes institucionais"
      description="Gestao de comunicados oficiais com destaque editorial, status de publicacao e leitura publica confiavel."
    >
      <NoticeManager initialNotices={notices} />
    </AdminPageShell>
  );
}
