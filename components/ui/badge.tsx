import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
  {
    variants: {
      variant: {
        default: "border-sky-200 bg-sky-50 text-sky-700",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        muted: "border-slate-200 bg-slate-100 text-slate-700",
        received: "border-sky-200 bg-sky-50 text-sky-700",
        in_review: "border-amber-200 bg-amber-50 text-amber-700",
        forwarded: "border-sky-200 bg-sky-50 text-sky-700",
        resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
        urgent: "border-rose-200 bg-rose-50 text-rose-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
