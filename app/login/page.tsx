import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { SectionContainer } from "@/components/ui/section-container";
import { canAccessBackoffice } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/server";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user && canAccessBackoffice(user.role)) {
    redirect("/admin");
  }

  return (
    <PageContainer
      className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_24%),linear-gradient(180deg,_#020617,_#0f172a_48%,_#111827)] py-4 text-white sm:py-10"
      variant="immersive"
    >
      <SectionContainer className="flex min-h-screen items-center py-4 sm:min-h-[calc(100vh-3rem)]">
        <div className="grid w-full gap-6 xl:grid-cols-[1fr_420px] xl:items-center">
          <div className="space-y-5 reveal-up">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/10 bg-slate-900 text-white" variant="muted">
                Acesso administrativo
              </Badge>
              <Badge className="border-emerald-800 bg-emerald-900 text-emerald-100">
                <Sparkles className="h-3.5 w-3.5" />
                Acesso seguro
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-[2.25rem] font-black tracking-tight sm:text-5xl lg:text-6xl">
                Acesso administrativo
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Ambiente restrito para gestao institucional do portal, comunicados, eventos e acompanhamento de demandas.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="safe-dark-card">
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-sky-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">Sessao protegida</p>
                  <p className="text-sm leading-6 text-slate-300">
                    Autenticacao segura e controle de acesso por permissoes institucionais.
                  </p>
                </CardContent>
              </Card>
              <Card className="safe-dark-card">
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-cyan-200">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">Ambiente restrito</p>
                  <p className="text-sm leading-6 text-slate-300">
                    A operacao administrativa permanece separada da navegacao publica do portal.
                  </p>
                </CardContent>
              </Card>
              <Card className="safe-dark-card">
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-emerald-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">Gestao operacional</p>
                  <p className="text-sm leading-6 text-slate-300">
                    Interface clara para atualizacao de comunicados, agenda e demandas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full reveal-up stagger-2">
            <LoginForm />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
