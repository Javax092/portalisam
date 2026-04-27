import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

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
    <main className="space-y-6">
      <Card className="overflow-hidden border-slate-200 bg-white">
        <CardContent className="grid gap-4 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <PageHeader eyebrow={eyebrow} title={title} description={description} />
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </CardContent>
      </Card>
      <AdminShell>{children}</AdminShell>
    </main>
  );
}
