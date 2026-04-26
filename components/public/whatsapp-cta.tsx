import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type WhatsAppCtaProps = {
  className?: string;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
  size?: "default" | "lg" | "sm";
  variant?: "button" | "inline";
};

export function WhatsAppCta({
  className,
  fullWidth = false,
  label = "Quero apoiar",
  onClick,
  size = "lg",
  variant = "button",
}: WhatsAppCtaProps) {
  if (variant === "inline") {
    return (
      <Link
        className={cn(
          "premium-focus inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-500 hover:shadow-md",
          fullWidth && "w-full justify-center",
          className,
        )}
        href={siteConfig.whatsappAdsLink}
        onClick={onClick}
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <Link
      className={cn(
        buttonVariants({ size, variant: "secondary" }),
        "rounded-2xl border-green-600 bg-green-600 text-white shadow-sm shadow-green-200/70 hover:-translate-y-0.5 hover:border-green-500 hover:bg-green-500 hover:text-white hover:shadow-md",
        fullWidth && "w-full",
        className,
      )}
      href={siteConfig.whatsappAdsLink}
      onClick={onClick}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Link>
  );
}
