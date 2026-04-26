import { LayoutDashboard } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";

type AdminHeaderProps = {
  currentPath: string;
  userName?: string | null;
};

export function AdminHeader({ currentPath, userName }: AdminHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-white shadow-sm shadow-sky-200/70">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-950">Area administrativa</p>
              <p className="text-sm text-slate-600">
                Gestao comunitaria com contexto humano e organizacao clara.
              </p>
            </div>
          </div>
          <Badge variant="muted">Sessao ativa{userName ? ` para ${userName}` : ""}</Badge>
        </div>
        <LogoutButton />
      </div>
      <AdminNav currentPath={currentPath} />
    </div>
  );
}
