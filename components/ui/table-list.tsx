import { cn } from "@/lib/utils";

export function TableList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-slate-950 shadow-soft shadow-slate-200/70",
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
        "grid gap-4 border-b border-slate-200/85 px-5 py-4 transition duration-200 last:border-b-0 hover:bg-slate-50 md:px-6",
        className,
      )}
      {...props}
    />
  );
}
