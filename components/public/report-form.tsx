"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  CheckCircle2,
  LoaderCircle,
  MapPinned,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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

const sectionCards = [
  {
    title: "Caracterizacao da demanda",
    description: "Resumo, categoria, prioridade e descricao institucional da situacao.",
    icon: MessageSquareText,
  },
  {
    title: "Localizacao da ocorrencia",
    description: "Endereco, bairro, referencias territoriais e coordenadas quando disponiveis.",
    icon: MapPinned,
  },
  {
    title: "Contato para retorno",
    description: "Dados opcionais para comunicacao da equipe responsavel.",
    icon: UserRound,
  },
] as const;

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
          "Demanda registrada com sucesso. A equipe responsavel podera analisar e atualizar o acompanhamento no portal.",
      });
      reset();
      setSelectedFileName(null);
      return;
    }

    setSubmitState({
      type: "error",
      message:
        data?.message ??
        "Nao foi possivel concluir o registro neste momento. Revise os campos informados e tente novamente.",
    });
  });

  return (
    <Card className="reveal-up interactive-border safe-card overflow-hidden">
      <CardHeader className="space-y-5 border-b border-slate-200/80 bg-slate-950 px-5 py-5 text-white sm:px-6 sm:py-6">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            Registro institucional
          </div>
          <div className="inline-flex items-center rounded-full border border-emerald-800 bg-emerald-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
            Canal oficial
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-white">Formalizacao institucional de demanda</CardTitle>
          <CardDescription className="text-slate-200">
            O portal consolida os dados essenciais para analise, classificacao e acompanhamento territorial.
          </CardDescription>
        </div>
        <div className="hidden gap-3 sm:grid-cols-3 lg:grid">
          {sectionCards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-slate-900 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 text-sky-200">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">{item.description}</p>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <form className="space-y-5 p-4 sm:space-y-6 sm:p-6" id="public-report-form" onSubmit={onSubmit}>
          <section className="space-y-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-sky-700">
                Identificacao da demanda
              </p>
              <h3 className="text-xl font-bold tracking-tight text-slate-950">Caracterizacao da situacao</h3>
            </div>

            <FormField
              error={errors.title?.message}
              hint="Informe um resumo objetivo para identificacao do registro."
              htmlFor="title"
              label="Titulo do registro"
            >
              <Input id="title" placeholder="Ex.: Iluminacao publica inoperante em via principal" {...register("title")} />
            </FormField>

            <FormField
              error={errors.description?.message}
              hint="Descreva a ocorrencia, os impactos observados e o contexto relevante para analise."
              htmlFor="description"
              label="Descricao da situacao"
            >
              <Textarea
                id="description"
                placeholder="Descreva a situacao com objetividade, incluindo impactos no territorio."
                {...register("description")}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField error={errors.category?.message} htmlFor="category" label="Categoria da demanda">
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

              <FormField error={errors.severity?.message} htmlFor="severity" label="Prioridade percebida">
                <Select defaultValue="" id="severity" {...register("severity")}>
                  <option value="" disabled>
                    Escolha a prioridade
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

          <section className="space-y-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-700">
                Referencia territorial
              </p>
              <h3 className="text-xl font-bold tracking-tight text-slate-950">Localizacao da ocorrencia</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField error={errors.address?.message} htmlFor="address" label="Localizacao da ocorrencia">
                <Input
                  id="address"
                  placeholder="Rua, ponto de referencia ou equipamento publico"
                  {...register("address")}
                />
              </FormField>

              <FormField error={errors.neighborhood?.message} htmlFor="neighborhood" label="Bairro ou comunidade">
                <Input id="neighborhood" placeholder="Ex.: Promorar" {...register("neighborhood")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                error={errors.latitude?.message}
                hint="Opcional. Utilize quando houver coordenada conhecida."
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
                hint="Opcional. Utilize quando houver coordenada conhecida."
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

            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Um ponto de referencia claro ja contribui para a localizacao institucional da demanda.
              Coordenadas complementam o registro quando disponiveis.
            </div>
          </section>

          <section className="space-y-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
                Contato institucional
              </p>
              <h3 className="text-xl font-bold tracking-tight text-slate-950">Contato para retorno</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField error={errors.submittedByName?.message} htmlFor="submittedByName" label="Nome completo">
                <Input
                  id="submittedByName"
                  placeholder="Nome da pessoa responsavel pelo registro"
                  {...register("submittedByName")}
                />
              </FormField>

              <FormField
                error={errors.submittedByPhone?.message}
                htmlFor="submittedByPhone"
                label="Contato para retorno"
              >
                <Input id="submittedByPhone" placeholder="Telefone ou WhatsApp" {...register("submittedByPhone")} />
              </FormField>
            </div>

            <FormField
              error={errors.submittedByEmail?.message}
              htmlFor="submittedByEmail"
              label="E-mail institucional ou pessoal"
            >
              <Input
                id="submittedByEmail"
                placeholder="contato@exemplo.org"
                type="email"
                {...register("submittedByEmail")}
              />
            </FormField>

            <div className="grid gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox className="mt-1" {...register("allowWhatsappUpdates")} />
                <span>
                  <strong className="block text-slate-950">Receber atualizacoes por WhatsApp</strong>
                  Autoriza o uso desse canal para retorno institucional sobre a demanda registrada.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <Checkbox className="mt-1" {...register("allowEmailUpdates")} />
                <span>
                  <strong className="block text-slate-950">Receber atualizacoes por e-mail</strong>
                  Autoriza o envio de comunicacoes formais por e-mail sobre o acompanhamento.
                </span>
              </label>
            </div>
          </section>

          <section className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-sky-50/70 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-950">Anexos ou evidencias, se houver</p>
                <p className="text-sm leading-6 text-slate-700">
                  O envio direto de arquivos ainda nao integra o fluxo do portal. Caso existam
                  evidencias, mantenha-as disponiveis para eventual solicitacao da equipe responsavel.
                </p>
              </div>
            </div>
            <input
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2.5 file:font-medium file:text-slate-700"
              onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? null)}
              type="file"
            />
            {selectedFileName ? <p className="text-sm text-slate-700">Arquivo selecionado: {selectedFileName}</p> : null}
          </section>

          {submitState ? <Toast message={submitState.message} type={submitState.type} /> : null}

          <section className="mobile-safe-pad sticky bottom-[5.5rem] z-10 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 text-white shadow-glow sm:bottom-3">
            <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  Pronto para envio
                </div>
                <p className="text-base font-bold tracking-tight sm:text-lg">
                  O registro fortalece o acompanhamento institucional no territorio.
                </p>
                <p className="text-sm leading-6 text-slate-200 sm:leading-7">
                  A demanda podera receber classificacao, atualizacoes operacionais e historico
                  publico no portal.
                </p>
              </div>
              <Button className="w-full sm:w-auto" disabled={isSubmitting} size="lg" type="submit">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar registro
                  </>
                )}
              </Button>
            </div>
          </section>

          <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-900">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Acompanhamento posterior
            </div>
            Demanda registrada com sucesso. A equipe responsavel podera analisar e atualizar o
            acompanhamento no portal.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
