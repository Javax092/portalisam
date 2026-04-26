"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

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
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setFormError(data?.message ?? "Nao foi possivel entrar agora.");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/admin";
    router.push(redirectTo);
    router.refresh();
  });

  return (
    <div
      className="
w-full
max-w-md
rounded-3xl
border
border-white/10
bg-white/[0.06]
p-8
shadow-2xl
backdrop-blur-xl
"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sky-300">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Portal</p>
          <p className="text-base font-semibold text-white">{siteConfig.appName}</p>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Acesso restrito</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Entre com suas credenciais para acessar o painel administrativo.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="email">
            E-mail
          </label>
          <input
            autoComplete="email"
            className="
mt-2
w-full
rounded-2xl
border
border-white/10
bg-white/10
px-4
py-3
text-white
placeholder:text-slate-500
outline-none
transition
focus:border-sky-400
focus:ring-4
focus:ring-sky-400/10
"
            id="email"
            placeholder="admin@promorar.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="password">
            Senha
          </label>
          <input
            autoComplete="current-password"
            className="
mt-2
w-full
rounded-2xl
border
border-white/10
bg-white/10
px-4
py-3
text-white
placeholder:text-slate-500
outline-none
transition
focus:border-sky-400
focus:ring-4
focus:ring-sky-400/10
"
            id="password"
            placeholder="Digite sua senha"
            type="password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p>
          ) : null}
        </div>

        {formError ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {formError}
          </div>
        ) : null}

        <button
          className="
w-full
rounded-2xl
bg-sky-500
px-4
py-3
font-semibold
text-white
shadow-lg
shadow-sky-500/20
transition
hover:bg-sky-400
focus:outline-none
focus:ring-4
focus:ring-sky-400/30
disabled:cursor-not-allowed
disabled:opacity-70
"
          disabled={isSubmitting}
          type="submit"
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Entrando..." : "Entrar no painel"}
          </span>
        </button>
      </form>

      <div className="mt-6">
        <Link
          className="
text-sm
font-medium
text-slate-300
hover:text-white
"
          href="/portal"
        >
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o portal
          </span>
        </Link>
      </div>
    </div>
  );
}
