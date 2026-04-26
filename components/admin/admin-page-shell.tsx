import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";

type AdminPageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function AdminPageShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: AdminPageShellProps) {
  return (
    <main className="pb-20 pt-8">
      <SectionContainer className="space-y-8" size="admin">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader eyebrow={eyebrow} title={title} description={description} />
          {actions}
        </div>
        <AdminShell>{children}</AdminShell>
      </SectionContainer>
    </main>
  );
}
