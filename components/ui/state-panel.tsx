import { AlertTriangle, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatePanelProps = {
  title: string;
  description: string;
  tone?: "loading" | "error";
  action?: React.ReactNode;
  className?: string;
};

export function StatePanel({
  title,
  description,
  tone = "loading",
  action,
  className,
}: StatePanelProps) {
  const Icon = tone === "error" ? AlertTriangle : LoaderCircle;

  return (
    <Card className={cn("mx-auto w-full max-w-xl overflow-hidden border-slate-200 bg-white", className)}>
      <CardContent className="p-6 text-center sm:p-8">
        <div
          className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 shadow-sm",
            tone === "error"
              ? "bg-rose-50 text-rose-700"
              : "bg-gradient-to-br from-sky-50 to-emerald-50 text-sky-800",
          )}
        >
          <Icon className={cn("h-6 w-6", tone === "loading" && "animate-spin")} />
        </div>
        <div className="mx-auto mt-5 max-w-md space-y-2">
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} type="button" variant="secondary">
      Tentar novamente
    </Button>
  );
}
