import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EventManager } from "@/components/admin/event-manager";
import { getAdminEvents } from "@/lib/admin-data";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <AdminPageShell
      eyebrow="Agenda institucional"
      title="Programacao publica e mobilizacao territorial"
      description="Gestao de eventos, acoes comunitarias e mobilizacoes territoriais em um fluxo administrativo organizado."
    >
      <EventManager initialEvents={events} />
    </AdminPageShell>
  );
}
