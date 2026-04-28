import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { SectionContainer } from "@/components/ui/section-container";

export const metadata: Metadata = {
  title: "Offline",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <PageContainer className="pt-4 sm:pt-6">
      <SectionContainer className="py-10 sm:py-14">
        <Card className="safe-card overflow-hidden rounded-[2rem]">
          <CardContent className="space-y-6 p-6 sm:p-8 md:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-slate-50 text-sky-700">
              <WifiOff className="h-6 w-6" />
            </div>

            <div className="space-y-3">
              <Badge variant="muted">Modo offline</Badge>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Voce esta sem conexao.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                Algumas informacoes publicas podem estar temporariamente disponiveis. Para registrar ou
                atualizar demandas, reconecte-se a internet.
              </p>
            </div>
          </CardContent>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
}
