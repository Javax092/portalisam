import { cn } from "@/lib/utils";

type FilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
