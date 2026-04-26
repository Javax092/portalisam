import { cn } from "@/lib/utils";

export function TableList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60",
        className,
      )}
      {...props}
    />
  );
}

export function TableListRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid gap-4 border-b border-slate-200 px-5 py-4 transition duration-200 last:border-b-0 hover:bg-slate-50 md:px-6",
        className,
      )}
      {...props}
    />
  );
}
