import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "premium-focus inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.985]",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground shadow-sm shadow-sky-200/70 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-md",
        default:
          "border-primary bg-primary text-primary-foreground shadow-sm shadow-sky-200/70 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-md",
        secondary:
          "border-slate-200 bg-white text-slate-800 shadow-sm shadow-slate-200/60 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md",
        ghost:
          "border-transparent bg-transparent text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-950",
        danger:
          "border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-200/70 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md",
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
