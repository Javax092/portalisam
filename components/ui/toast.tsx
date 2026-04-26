import { CheckCircle2, CircleAlert, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastProps = {
  type: "success" | "error" | "warning";
  message: string;
  className?: string;
};

export function Toast({ type, message, className }: ToastProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-soft",
        type === "success"
          ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
          : type === "warning"
            ? "border-amber-200 bg-amber-50/95 text-amber-900"
            : "border-rose-200 bg-rose-50/95 text-rose-900",
        className,
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : type === "warning" ? (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <p className="leading-6">{message}</p>
    </div>
  );
}
