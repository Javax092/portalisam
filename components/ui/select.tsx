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
          "premium-focus flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-control outline-none transition duration-200 hover:border-slate-400 focus:border-primary disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-60",
          error && "border-rose-300 bg-rose-50/40 focus:border-rose-500",
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
