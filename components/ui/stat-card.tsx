import type { LucideIcon } from "lucide-react";

import { MetricCard } from "@/components/ui/metric-card";

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
  const metricTone =
    tone === "emerald" ? "emerald" : tone === "amber" ? "amber" : tone === "slate" ? "slate" : "sky";

  return (
    <MetricCard
      className={className}
      helper={helper}
      icon={Icon}
      label={label}
      tone={metricTone}
      value={value}
    />
  );
}
