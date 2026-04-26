import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EventManager } from "@/components/admin/event-manager";
import { getAdminEvents } from "@/lib/admin-data";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <AdminPageShell
      eyebrow="Eventos"
      title="Agenda de encontros e mobilizacoes"
      description="Cadastre encontros, mutiroes e acoes locais com uma experiencia simples e organizada."
    >
      <EventManager initialEvents={events} />
    </AdminPageShell>
  );
}
