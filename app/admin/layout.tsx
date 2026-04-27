import { headers } from "next/headers";

import { AdminHeader } from "@/components/admin/admin-header";
import { getCurrentUser, requireBackofficeSession } from "@/lib/auth/server";
import { SectionContainer } from "@/components/ui/section-container";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireBackofficeSession();
  const user = await getCurrentUser();
  const currentPath = (await headers()).get("x-current-path") || "/admin";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.1),_transparent_22%),linear-gradient(180deg,_rgba(248,250,252,0.94),_rgba(255,255,255,1)_36%,_rgba(241,245,249,0.96))] py-4 sm:py-6">
      <SectionContainer size="wide">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <aside className="xl:sticky xl:top-6">
            <AdminHeader currentPath={currentPath} userName={user?.name} userRole={user?.role} />
          </aside>
          <div className="space-y-6">{children}</div>
        </div>
      </SectionContainer>
    </div>
  );
}
