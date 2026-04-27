import { AlertTriangle, Flame, Minus, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PriorityTone = "low" | "medium" | "high" | "urgent";

const toneClasses: Record<PriorityTone, string> = {
  low: "border-slate-200 bg-slate-100 text-slate-700",
  medium: "border-cyan-200 bg-cyan-50 text-cyan-800",
  high: "border-amber-200 bg-amber-50 text-amber-800",
  urgent: "border-rose-200 bg-rose-50 text-rose-800",
};

const toneIcons: Record<PriorityTone, React.ReactNode> = {
  low: <Minus className="h-3.5 w-3.5" />,
  medium: <Waves className="h-3.5 w-3.5" />,
  high: <AlertTriangle className="h-3.5 w-3.5" />,
  urgent: <Flame className="h-3.5 w-3.5" />,
};

type PriorityBadgeProps = {
  label: string;
  tone: PriorityTone;
  className?: string;
};

export function PriorityBadge({ label, tone, className }: PriorityBadgeProps) {
  return (
    <Badge className={cn("px-3 py-1.5 normal-case tracking-normal", toneClasses[tone], className)}>
      {toneIcons[tone]}
      <span>{label}</span>
    </Badge>
  );
}
