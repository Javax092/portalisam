import { CheckCircle2, HeartHandshake, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

import { ReportForm } from "@/components/public/report-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";
import { SponsoredBanner } from "@/components/ui/sponsored-banner";

export default function ReportPage() {
  return (
    <main className="pb-24 pt-6 sm:pt-10">
      <SectionContainer className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="space-y-8">
          <PageHeader
            eyebrow="Participação pública"
            title="Registrar um problema deve ser simples, acolhedor e confiável"
            description="Preencha em poucos minutos, com linguagem clara e ajuda em cada etapa. O objetivo é facilitar a escuta da comunidade, não criar burocracia."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="surface-highlight">
              <CardContent className="p-5">
                <HeartHandshake className="mb-4 h-6 w-6 text-emerald-700" />
                <p className="font-semibold text-foreground">Sua voz ajuda o bairro</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Cada relato ajuda a dar visibilidade ao que a comunidade está vivendo no dia a dia.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <MapPinned className="mb-4 h-6 w-6 text-sky-700" />
                <p className="font-semibold text-foreground">Localização quando souber</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Um ponto de referência já ajuda bastante. Coordenadas são opcionais e não travam o envio.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <ShieldCheck className="mb-4 h-6 w-6 text-sky-700" />
                <p className="font-semibold text-foreground">Formulário fácil de preencher</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Apenas as informações essenciais para registrar o problema com clareza e confiança.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-sky-100 bg-gradient-to-br from-sky-50 to-white">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sky-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-[0.08em]">Antes de enviar</span>
              </div>
              <p className="text-sm leading-7 text-slate-700">
                Se quiser agilizar a leitura da equipe, descreva o local, diga desde quando acontece e conte como o problema afeta a rotina das pessoas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 text-white">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                O que acontece depois do envio
              </div>
              <div className="grid gap-3">
                <div className="rounded-[1.25rem] bg-white/8 p-4 text-sm leading-6 text-slate-200">A demanda entra na fila de acompanhamento do portal.</div>
                <div className="rounded-[1.25rem] bg-white/8 p-4 text-sm leading-6 text-slate-200">O status pode ser atualizado para recebida, em análise, em andamento ou resolvida.</div>
                <div className="rounded-[1.25rem] bg-white/8 p-4 text-sm leading-6 text-slate-200">Se você deixar contato, a equipe pode retornar com orientações ou novidade do caso.</div>
              </div>
            </CardContent>
          </Card>

          <SponsoredBanner
            compact
            description="A mesma estrutura do portal pode futuramente destacar comércios, serviços e parceiros que apoiam a comunidade."
            title="O portal já está pronto para receber anúncios locais"
          />

          <Badge>Contribuição pública para fortalecer o território</Badge>
        </div>

        <ReportForm />
      </SectionContainer>
    </main>
  );
}
