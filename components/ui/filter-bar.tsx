import { cn } from "@/lib/utils";

type FilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-slate-200 bg-white text-slate-950 shadow-soft shadow-slate-200/70 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
