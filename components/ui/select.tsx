import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, helperText, id, label, ...props }, ref) => {
    const select = (
      <select
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={cn(
          "premium-focus flex h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(15,23,42,0.05)] outline-none transition duration-200 hover:border-slate-400 focus:border-sky-500 focus:bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500",
          error && "border-rose-300 bg-rose-50/40 focus:border-rose-400",
          className,
        )}
        id={id}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );

    if (!label && !helperText && !error) {
      return select;
    }

    return (
      <div className="space-y-2">
        {label ? (
          <label className="text-sm font-semibold text-foreground" htmlFor={id}>
            {label}
          </label>
        ) : null}
        {select}
        {helperText && !error ? (
          <p className="text-sm leading-6 text-slate-500" id={id ? `${id}-helper` : undefined}>
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm font-medium leading-6 text-rose-600" id={id ? `${id}-error` : undefined}>
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
