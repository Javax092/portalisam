import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: "sky" | "emerald" | "amber" | "slate";
  className?: string;
};

const tones = {
  sky: "bg-sky-50 text-sky-700 border border-sky-200",
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  slate: "bg-slate-50 text-slate-700 border border-slate-200",
} as const;

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "sky",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("premium-card-hover h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70", className)}>
      <CardContent className="space-y-4 p-0">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          {helper ? <p className="text-sm leading-6 text-slate-500">{helper}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
