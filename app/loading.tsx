import { LoadingState } from "@/components/ui/loading-state";
import { PageContainer } from "@/components/ui/page-container";
import { SectionContainer } from "@/components/ui/section-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer className="pt-10 sm:pt-14">
      <SectionContainer className="space-y-8">
        <LoadingState
          description="Estamos preparando as informacoes desta tela para manter a leitura clara e atualizada."
          title="Carregando o portal"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </SectionContainer>
    </PageContainer>
  );
}
