"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  LoaderCircle,
  MapPinned,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { categoryOptions, severityOptions } from "@/lib/community";
import {
  publicCreateReportSchema,
  type PublicCreateReportInput,
} from "@/lib/validations/report";

export function ReportForm() {
  const [submitState, setSubmitState] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublicCreateReportInput>({
    resolver: zodResolver(publicCreateReportSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      severity: undefined,
      address: "",
      neighborhood: "",
      imageUrl: "",
      submittedByName: "",
      submittedByEmail: "",
      submittedByPhone: "",
      allowEmailUpdates: false,
      allowWhatsappUpdates: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState(null);

    const response = await fetch("/api/public/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (response.ok) {
      setSubmitState({
        type: "success",
        message:
          data?.message ??
          "Recebemos seu relato. Agora a comunidade e a equipe de gestao podem acompanhar o caso.",
      });
      reset();
      setSelectedFileName(null);
      return;
    }

    setSubmitState({
      type: "error",
      message:
        data?.message ??
        "Nao foi possivel enviar agora. Tente novamente em instantes ou revise os campos destacados.",
    });
  });

  return (
    <Card className="overflow-hidden border-white/80">
      <CardHeader className="space-y-5 border-b border-border/60 bg-slate-950 text-white">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
            Fluxo guiado
          </div>
          <div className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-100">
            Leva poucos minutos
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-white">Conte o problema como voce contaria no WhatsApp</CardTitle>
          <CardDescription className="text-slate-200">
            Vamos pedir so o essencial: o que aconteceu, onde foi e como a equipe pode acompanhar.
          </CardDescription>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">1. O que aconteceu</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">Descreva com palavras simples.</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">2. Onde foi</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">Um ponto de referencia ja ajuda.</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">3. Como avisar voce</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">Opcional, se quiser receber retorno.</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-0">
        <form className="space-y-6 p-5 sm:p-6" id="public-report-form" onSubmit={onSubmit}>
          <section className="space-y-5 rounded-lg border border-border/70 bg-white p-5 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-sky-700">
                Sobre o problema
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                O que esta acontecendo?
              </h3>
            </div>

            <FormField
              error={errors.title?.message}
              hint="Exemplo real: Poste apagado perto da escola e rua muito escura a noite."
              htmlFor="title"
              label="Resuma em uma frase"
            >
              <Input id="title" placeholder="Ex.: Buraco grande em frente ao posto de saude" {...register("title")} />
            </FormField>

            <FormField
              error={errors.description?.message}
              hint="Explique o que voce viu, ha quanto tempo acontece e se isso afeta seguranca, mobilidade ou limpeza."
              htmlFor="description"
              label="Conte um pouco mais"
            >
              <Textarea
                id="description"
                placeholder="Ex.: O buraco aumentou depois da chuva e carros estao desviando pela calcada."
                {...register("description")}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                error={errors.category?.message}
                htmlFor="category"
                label="Que tipo de problema e esse?"
              >
                <Select defaultValue="" id="category" {...register("category")}>
                  <option value="" disabled>
                    Escolha a categoria
                  </option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                error={errors.severity?.message}
                htmlFor="severity"
                label="Qual a urgencia percebida?"
              >
                <Select defaultValue="" id="severity" {...register("severity")}>
                  <option value="" disabled>
                    Escolha a urgencia
                  </option>
                  {severityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </section>

          <section className="space-y-5 rounded-lg border border-border/70 bg-slate-50/80 p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-700">
                Local
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Onde isso esta acontecendo?
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                error={errors.address?.message}
                htmlFor="address"
                label="Ponto de referencia ou endereco"
              >
                <Input
                  id="address"
                  placeholder="Ex.: Rua principal, em frente ao mercadinho azul"
                  {...register("address")}
                />
              </FormField>

              <FormField
                error={errors.neighborhood?.message}
                htmlFor="neighborhood"
                label="Bairro ou comunidade"
              >
                <Input id="neighborhood" placeholder="Ex.: Promorar" {...register("neighborhood")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                error={errors.latitude?.message}
                hint="Opcional. Preencha so se voce souber."
                htmlFor="latitude"
                label="Latitude"
              >
                <Input
                  id="latitude"
                  placeholder="-3.1190"
                  step="any"
                  type="number"
                  {...register("latitude", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                error={errors.longitude?.message}
                hint="Opcional. O ponto de referencia acima ja resolve na maioria dos casos."
                htmlFor="longitude"
                label="Longitude"
              >
                <Input
                  id="longitude"
                  placeholder="-60.0217"
                  step="any"
                  type="number"
                  {...register("longitude", { valueAsNumber: true })}
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-5 rounded-lg border border-border/70 bg-white p-5 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
                Contato opcional
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Quer receber atualizacoes?
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                error={errors.submittedByName?.message}
                htmlFor="submittedByName"
                label="Seu nome"
              >
                <Input id="submittedByName" placeholder="Ex.: Maria Souza" {...register("submittedByName")} />
              </FormField>

              <FormField
                error={errors.submittedByPhone?.message}
                htmlFor="submittedByPhone"
                label="WhatsApp"
              >
                <Input
                  id="submittedByPhone"
                  placeholder="Ex.: (92) 99999-0000"
                  {...register("submittedByPhone")}
                />
              </FormField>
            </div>

            <FormField
              error={errors.submittedByEmail?.message}
              htmlFor="submittedByEmail"
              label="E-mail"
            >
              <Input
                id="submittedByEmail"
                placeholder="Ex.: morador@email.com"
                type="email"
                {...register("submittedByEmail")}
              />
            </FormField>

            <div className="grid gap-3 rounded-lg bg-slate-50 p-4">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox className="mt-1" {...register("allowWhatsappUpdates")} />
                <span>
                  <strong className="block text-foreground">Receber novidades por WhatsApp</strong>
                  Quando houver retorno sobre a demanda, a equipe pode avisar por este canal.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox className="mt-1" {...register("allowEmailUpdates")} />
                <span>
                  <strong className="block text-foreground">Receber novidades por e-mail</strong>
                  Use se preferir registrar o acompanhamento de forma escrita.
                </span>
              </label>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border/70 bg-sky-50/60 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Foto opcional</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  O envio direto de imagem ainda nao esta ativo, mas voce ja pode separar a foto
                  que ajuda a comprovar a situacao.
                </p>
              </div>
            </div>
            <input
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-medium"
              onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? null)}
              type="file"
            />
            {selectedFileName ? (
              <p className="text-sm text-slate-700">Arquivo selecionado: {selectedFileName}</p>
            ) : null}
          </section>

          {submitState ? <Toast message={submitState.message} type={submitState.type} /> : null}

          <div className="hidden items-center gap-3 rounded-lg border border-border/70 bg-slate-950 p-4 text-white shadow-glow sm:flex">
            <div className="flex-1">
              <p className="font-semibold">Pronto para enviar?</p>
              <p className="text-sm leading-6 text-slate-200">
                Seu relato fica visivel para acompanhamento publico e ajuda a equipe a agir com mais contexto.
              </p>
            </div>
            <Button className="shrink-0" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar demanda
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="grid gap-3 border-t border-border/60 bg-slate-50 p-5 sm:grid-cols-3 sm:p-6">
          <div className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Linguagem simples
            </div>
            Preencha do jeito que voce falaria com um vizinho ou lideranca local.
          </div>
          <div className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <MapPinned className="h-4 w-4 text-sky-700" />
              Local ajuda muito
            </div>
            Mesmo sem coordenadas, um bom ponto de referencia ja acelera o entendimento.
          </div>
          <div className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              Contato e opcional
            </div>
            Voce pode registrar a demanda sem expor mais dados do que deseja.
          </div>
        </div>

        <div className="sticky bottom-0 z-20 flex items-center gap-3 border-t border-border/70 bg-white/95 p-4 backdrop-blur sm:hidden">
          <Link className={buttonVariants({ className: "flex-1", variant: "secondary" })} href="/reports">
            <Smartphone className="h-4 w-4" />
            Acompanhar
          </Link>
          <Button className="flex-[1.3]" disabled={isSubmitting} form="public-report-form" size="lg" type="submit">
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </div>

        <div className="px-5 pb-5 sm:hidden">
          <Link className={buttonVariants({ className: "w-full", variant: "ghost" })} href="/reports">
            Ver demandas ja registradas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
