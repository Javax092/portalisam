import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "h-4 w-4 rounded border border-border text-primary shadow-sm transition focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100",
          className,
        )}
        ref={ref}
        type="checkbox"
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";
