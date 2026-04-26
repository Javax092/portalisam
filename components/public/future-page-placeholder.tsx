import Link from "next/link";
import { ArrowLeft, Clock3, MapPinned, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";

type FuturePagePlaceholderProps = {
  title: string;
  description: string;
  label: string;
};

export function FuturePagePlaceholder({
  title,
  description,
  label,
}: FuturePagePlaceholderProps) {
  return (
    <main className="pb-20 pt-8">
      <SectionContainer className="space-y-8">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-foreground" href="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar para a página inicial
        </Link>

        <PageHeader
          eyebrow={label}
          title={title}
          description={description}
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
            <CardHeader>
              <Badge>Base pronta para crescer</Badge>
              <CardTitle>Este espaço já faz parte da arquitetura do produto</CardTitle>
              <CardDescription>
                A rota, o layout e a identidade visual foram preparados para evoluir sem
                improviso quando entrarmos nas próximas etapas.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-4">
                <Clock3 className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">Fluxos futuros</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Estrutura pronta para autenticação, permissões e formulários completos.
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <MapPinned className="mb-3 h-5 w-5 text-emerald-600" />
                <p className="font-semibold text-foreground">Integração territorial</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Projeto preparado para receber mapa comunitário e visualização geográfica.
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <Sparkles className="mb-3 h-5 w-5 text-sky-600" />
                <p className="font-semibold text-foreground">Experiência consistente</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Componentes reutilizáveis garantem uma base limpa para as próximas telas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximo passo desta área</CardTitle>
              <CardDescription>
                Quando avançarmos, esta página pode receber regras, integrações e conteúdo real
                sem quebrar a arquitetura inicial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-muted-foreground">
                Nesta etapa, o foco foi criar a fundação visual e técnica do portal com rotas
                públicas e placeholders elegantes.
              </div>
              <Link className={buttonVariants({ className: "w-full" })} href="/">Voltar para a apresentacao</Link>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </main>
  );
}
