import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  return (
    <Card className="premium-card-hover rounded-3xl border-slate-200 bg-white">
      <CardContent className="space-y-4 p-6">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", toneClassName)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <p className="text-4xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
