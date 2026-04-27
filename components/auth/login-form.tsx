"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { siteConfig } from "@/lib/site";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }),
    }).catch(() => null);

    if (!response) {
      setFormError("Servidor de autenticacao indisponivel.");
      return;
    }

    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      if (data?.message) {
        setFormError(data.message);
        return;
      }

      if (response.status === 401) {
        setFormError("Nao foi possivel validar as credenciais informadas.");
        return;
      }

      if (response.status === 403) {
        setFormError("Usuario inativo.");
        return;
      }

      if (response.status === 500) {
        setFormError("Configuracao do servidor incompleta.");
        return;
      }

      setFormError("Servidor de autenticacao indisponivel.");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/admin";
    router.push(redirectTo);
    router.refresh();
  });

  return (
    <Card className="interactive-border safe-card overflow-hidden text-slate-950">
      <CardHeader className="space-y-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sky-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Portal institucional</p>
            <p className="text-lg font-bold text-slate-950">{siteConfig.appName}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-slate-200 bg-slate-50 text-slate-700" variant="muted">
              Acesso interno
            </Badge>
          </div>
          <div>
            <CardTitle className="text-slate-950">Acesso administrativo</CardTitle>
            <CardDescription className="mt-2 text-slate-700">
              Utilize suas credenciais para acessar o ambiente administrativo institucional.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <form className="space-y-5" onSubmit={onSubmit}>
          <Input
            autoComplete="email"
            className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500"
            error={errors.email?.message}
            id="email"
            label="E-mail"
            labelClassName="text-slate-700"
            placeholder="admin@isam.org"
            {...register("email")}
          />

          <Input
            autoComplete="current-password"
            className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500"
            error={errors.password?.message}
            id="password"
            label="Senha"
            labelClassName="text-slate-700"
            placeholder="Digite sua senha"
            type="password"
            {...register("password")}
          />

          {formError ? <Toast message={formError} type="error" /> : null}

          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar no painel"
            )}
          </Button>
        </form>

        <Link className="premium-focus inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800" href="/portal">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao portal
        </Link>
      </CardContent>
    </Card>
  );
}
