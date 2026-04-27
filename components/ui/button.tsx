import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "premium-focus inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed active:scale-[0.985]",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground shadow-[0_18px_40px_rgba(15,23,42,0.14)] hover:-translate-y-0.5 hover:border-sky-900 hover:bg-sky-900 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)]",
        default:
          "border-primary bg-primary text-primary-foreground shadow-[0_18px_40px_rgba(15,23,42,0.14)] hover:-translate-y-0.5 hover:border-sky-900 hover:bg-sky-900 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)]",
        secondary:
          "border-slate-200 bg-white text-slate-800 shadow-sm shadow-slate-200/70 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:text-slate-950 hover:shadow-md disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none",
        ghost:
          "border-transparent bg-transparent text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-950 disabled:bg-transparent disabled:text-slate-400",
        danger:
          "border-rose-600 bg-rose-600 text-white shadow-[0_18px_40px_rgba(244,63,94,0.16)] hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-[0_22px_48px_rgba(244,63,94,0.22)]",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-14 px-7 text-base",
        sm: "h-9 px-4 text-sm",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, loading = false, type = "button", variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        ref={ref}
        type={type}
        {...props}
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
