import {
  CheckCircle2,
  ClipboardPenLine,
  MapPinned,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ReportForm } from "@/components/public/report-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";

const guideItems = [
  {
    title: "Formalizacao objetiva",
    description:
      "O registro deve consolidar a situacao observada com contexto suficiente para analise institucional.",
    icon: ClipboardPenLine,
  },
  {
    title: "Referencia territorial",
    description:
      "Endereco, bairro, ponto de referencia e coordenadas qualificam o acompanhamento territorial.",
    icon: MapPinned,
  },
  {
    title: "Contato para retorno",
    description:
      "Os canais informados podem ser utilizados pela equipe responsavel para retorno institucional.",
    icon: MessageSquareHeart,
  },
] as const;

export default function ReportPage() {
  return (
    <PageContainer className="pt-4 sm:pt-6">
      <SectionContainer className="space-y-8">
        <div className="reveal-up safe-section safe-card overflow-hidden rounded-[2rem]">
          <div className="relative z-10 grid gap-8 px-5 py-6 sm:px-8 sm:py-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">Canal oficial</Badge>
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5" />
                    Registro institucional
                  </Badge>
                </div>

                <SectionHeader
                  eyebrow="Registro comunitario"
                  description="Canal oficial para formalizar solicitacoes, ocorrencias e necessidades do territorio."
                  title="Registro comunitario de demanda"
                />
              </div>

              <div className="grid gap-4">
                {guideItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Card key={item.title} className="premium-card-hover">
                      <CardContent className="flex gap-4 p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-xl font-bold tracking-tight text-slate-950">{item.title}</h2>
                          <p className="text-sm leading-7 text-slate-700">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="safe-section overflow-hidden safe-dark-card">
                <CardContent className="p-6">
                  <div
                    aria-hidden="true"
                    className="safe-bg bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.06),_transparent_20%)]"
                  />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-sky-200">
                      <ShieldCheck className="h-4 w-4" />
                      Acompanhamento institucional
                    </div>
                    <div className="grid gap-3">
                      <div className="rounded-[1.25rem] border border-white/10 bg-slate-900 p-4 text-sm leading-6 text-slate-200">
                        O registro ingressa no fluxo institucional de acompanhamento e pode receber atualizacoes publicas.
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-slate-900 p-4 text-sm leading-6 text-slate-200">
                        A equipe responsavel atualiza prioridade, status e historico conforme a evolucao da demanda.
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-slate-900 p-4 text-sm leading-6 text-slate-200">
                        Quando houver contato informado, o retorno institucional pode ocorrer pelos canais autorizados.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ReportForm />
          </div>
        </div>

        <Card className="border-slate-200 bg-white">
          <CardContent className="grid gap-4 p-6 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                Clareza
              </div>
              <p className="text-sm leading-6 text-slate-600">
                O registro solicita apenas informacoes essenciais para contextualizar a demanda.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                <ShieldCheck className="h-4 w-4 text-sky-700" />
                Confianca
              </div>
              <p className="text-sm leading-6 text-slate-600">
                A experiencia prioriza seguranca, leitura institucional e operacao confiavel.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                <MapPinned className="h-4 w-4 text-cyan-700" />
                Territorio
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Localizacao e historico publico fortalecem o acompanhamento territorial da ocorrencia.
              </p>
            </div>
          </CardContent>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
