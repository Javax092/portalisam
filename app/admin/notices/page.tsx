import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { NoticeManager } from "@/components/admin/notice-manager";
import { getAdminNotices } from "@/lib/admin-data";

export default async function AdminNoticesPage() {
  const notices = await getAdminNotices();

  return (
    <AdminPageShell
      eyebrow="Avisos"
      title="Comunicados para a comunidade"
      description="Crie, ajuste e destaque avisos para manter a comunicacao publica clara e confiavel."
    >
      <NoticeManager initialNotices={notices} />
    </AdminPageShell>
  );
}
