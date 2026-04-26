"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { RetryButton, StatePanel } from "@/components/ui/state-panel";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="bg-hero-grid py-16 sm:py-24">
      <SectionContainer>
        <StatePanel
          action={<RetryButton onClick={reset} />}
          description="Nao foi possivel concluir esta acao agora. Voce pode tentar recarregar sem perder a navegacao."
          title="Algo saiu do esperado"
          tone="error"
        />
      </SectionContainer>
    </main>
  );
}
