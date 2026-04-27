import type { LucideIcon } from "lucide-react";

import { MetricCard } from "@/components/ui/metric-card";

type AdminMetricCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  toneClassName: string;
};

export function AdminMetricCard({
  title,
  value,
  description,
  icon: Icon,
  toneClassName,
}: AdminMetricCardProps) {
  const tone = toneClassName.includes("emerald")
    ? "emerald"
    : toneClassName.includes("amber")
      ? "amber"
      : toneClassName.includes("indigo")
        ? "cyan"
        : toneClassName.includes("slate")
          ? "slate"
          : "sky";

  return (
    <MetricCard helper={description} icon={Icon} label={title} tone={tone} value={value} />
  );
}
