import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  labelClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, errorClassName, helperClassName, helperText, id, label, labelClassName, type = "text", ...props }, ref) => {
    const input = (
      <input
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={cn(
          "premium-focus flex min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(15,23,42,0.05)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500 focus:bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 sm:h-12 sm:py-3 sm:text-sm",
          error && "border-rose-300 bg-rose-50/40 focus:border-rose-400",
          className,
        )}
        id={id}
        ref={ref}
        type={type}
        {...props}
      />
    );

    if (!label && !helperText && !error) {
      return input;
    }

    return (
      <div className="space-y-2">
        {label ? (
          <label className={cn("text-sm font-semibold text-foreground", labelClassName)} htmlFor={id}>
            {label}
          </label>
        ) : null}
        {input}
        {helperText && !error ? (
          <p className={cn("text-sm leading-6 text-slate-500", helperClassName)} id={id ? `${id}-helper` : undefined}>
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p className={cn("text-sm font-medium leading-6 text-rose-600", errorClassName)} id={id ? `${id}-error` : undefined}>
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
