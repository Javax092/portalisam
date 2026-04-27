import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardTone = "navy" | "sky" | "cyan" | "emerald" | "amber" | "slate";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: MetricCardTone;
  className?: string;
  emphasis?: "default" | "strong";
};

const toneClasses: Record<MetricCardTone, string> = {
  navy: "border-slate-900/10 bg-slate-900 text-white shadow-slate-950/20",
  sky: "border-sky-200 bg-sky-50 text-sky-800 shadow-sky-200/50",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-800 shadow-cyan-200/50",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-200/50",
  amber: "border-amber-200 bg-amber-50 text-amber-900 shadow-amber-200/50",
  slate: "border-slate-200 bg-slate-50 text-slate-800 shadow-slate-200/50",
};

const iconToneClasses: Record<MetricCardTone, string> = {
  navy: "bg-slate-900 text-white border border-slate-700",
  sky: "bg-white text-sky-700 border border-sky-200",
  cyan: "bg-white text-cyan-700 border border-cyan-200",
  emerald: "bg-white text-emerald-700 border border-emerald-200",
  amber: "bg-white text-amber-700 border border-amber-200",
  slate: "bg-white text-slate-700 border border-slate-200",
};

export function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "sky",
  className,
  emphasis = "default",
}: MetricCardProps) {
  const strong = emphasis === "strong";

  return (
    <Card
      className={cn(
        "interactive-border premium-card-hover h-full overflow-hidden rounded-[1.75rem] border p-0",
        strong ? toneClasses[tone] : "border-slate-200 bg-white text-slate-950",
        className,
      )}
    >
      <CardContent className="relative space-y-5 p-5 sm:p-6">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm", strong ? iconToneClasses[tone] : "border border-slate-200 bg-white text-slate-900")}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <p className={cn("text-sm font-semibold", strong ? "text-slate-300" : "text-slate-700")}>
            {label}
          </p>
          <p className={cn("text-3xl font-black tracking-tight sm:text-[2rem]", strong ? "text-white" : "text-slate-950")}>
            {value}
          </p>
          {helper ? (
            <p className={cn("text-sm leading-6", strong ? "text-slate-300" : "text-slate-600")}>
              {helper}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
