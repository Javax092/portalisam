import { AlertTriangle, CheckCircle2, Clock3, Eye, Minus } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "open" | "review" | "progress" | "resolved" | "archived" | "low" | "medium" | "high" | "urgent";

const toneVariants: Record<StatusTone, BadgeProps["variant"]> = {
  open: "received",
  review: "in_review",
  progress: "forwarded",
  resolved: "resolved",
  archived: "muted",
  low: "muted",
  medium: "in_review",
  high: "forwarded",
  urgent: "urgent",
};

const toneIcons: Record<StatusTone, React.ReactNode> = {
  open: <Clock3 className="h-3.5 w-3.5" />,
  review: <Eye className="h-3.5 w-3.5" />,
  progress: <AlertTriangle className="h-3.5 w-3.5" />,
  resolved: <CheckCircle2 className="h-3.5 w-3.5" />,
  archived: <Minus className="h-3.5 w-3.5" />,
  low: <Minus className="h-3.5 w-3.5" />,
  medium: <Clock3 className="h-3.5 w-3.5" />,
  high: <AlertTriangle className="h-3.5 w-3.5" />,
  urgent: <AlertTriangle className="h-3.5 w-3.5" />,
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  className?: string;
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <Badge className={cn("px-3 py-1.5 normal-case tracking-normal", className)} variant={toneVariants[tone]}>
      {toneIcons[tone]}
      <span>{label}</span>
    </Badge>
  );
}
