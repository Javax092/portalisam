import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm shadow-slate-200/60 sm:p-8",
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 shadow-sm">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <div className="mx-auto mt-4 max-w-lg space-y-2">
        <h3 className="text-lg font-bold leading-tight text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
