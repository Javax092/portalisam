"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function InstallAppButton({ className }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!promptEvent || isInstalled) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-50 sm:inset-x-auto sm:right-6 sm:w-[22rem] sm:bottom-6",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-700">Acesso rapido</p>
            <p className="text-base font-bold tracking-tight text-slate-950">Instalar aplicativo</p>
            <p className="text-sm leading-6 text-slate-600">
              Adicione o portal a tela inicial para abrir em tela cheia.
            </p>
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          disabled={isInstalling}
          onClick={async () => {
            if (!promptEvent) {
              return;
            }

            setIsInstalling(true);

            try {
              await promptEvent.prompt();
              const result = await promptEvent.userChoice;

              if (result.outcome === "accepted") {
                setIsInstalled(true);
              }
            } finally {
              setPromptEvent(null);
              setIsInstalling(false);
            }
          }}
          size="default"
        >
          <Download className="h-4 w-4" />
          Instalar aplicativo
        </Button>
      </div>
    </div>
  );
}
