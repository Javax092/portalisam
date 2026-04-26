import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-900" htmlFor={htmlFor}>
          {label}
        </label>
        {hint ? <p className="text-sm leading-6 text-slate-500">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm font-medium leading-6 text-rose-600">{error}</p> : null}
    </div>
  );
}
