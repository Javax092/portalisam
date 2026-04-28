import { UserRole } from "@prisma/client";
import { LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";

type AdminHeaderProps = {
  currentPath: string;
  userName?: string | null;
  userRole?: UserRole | null;
};

export function AdminHeader({ currentPath, userName, userRole }: AdminHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="reveal-up overflow-hidden rounded-[2rem] safe-dark-card shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-sky-200">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold tracking-tight text-white sm:text-lg">Painel administrativo institucional</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Gestao institucional do portal com leitura executiva sobre comunicados, agenda e demandas.
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Sessao ativa
              </div>
              <p className="font-semibold text-white">{userName || "Usuario autenticado"}</p>
              <p className="mt-1 text-sm text-slate-300">{userRole || "Permissao validada"}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                <UserRound className="h-4 w-4 text-sky-200" />
                Governanca
              </div>
              <p className="text-sm leading-6 text-slate-300">
                A navegacao interna organiza publicacoes oficiais, agenda institucional, demandas e configuracoes sem interferir no portal publico.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="reveal-up stagger-2 rounded-[2rem] border border-slate-200 bg-white p-4 text-slate-950 shadow-soft shadow-slate-200/70">
        <div className="mb-3 px-2">
          <Badge variant="muted">Navegacao administrativa</Badge>
        </div>
        <AdminNav currentPath={currentPath} userRole={userRole ?? undefined} />
      </div>
    </div>
  );
}
