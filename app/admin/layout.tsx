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
    <div className="pb-8 pt-8">
      <SectionContainer className="space-y-8" size="admin">
        <AdminHeader currentPath={currentPath} userName={user?.name} userRole={user?.role} />
      </SectionContainer>
      {children}
    </div>
  );
}
