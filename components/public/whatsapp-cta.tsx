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
  target?: "ads" | "community";
  variant?: "button" | "inline";
};

export function WhatsAppCta({
  className,
  fullWidth = false,
  label = "Canal institucional",
  onClick,
  size = "lg",
  target = "ads",
  variant = "button",
}: WhatsAppCtaProps) {
  const href = target === "community" ? siteConfig.whatsappCommunityLink : siteConfig.whatsappAdsLink;

  if (variant === "inline") {
    return (
      <Link
        className={cn(
          "premium-focus inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-md",
          fullWidth && "w-full justify-center",
          className,
        )}
        href={href}
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
        "rounded-full border-emerald-600 bg-emerald-600 text-white shadow-[0_18px_40px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-[0_22px_50px_rgba(16,185,129,0.24)]",
        fullWidth && "w-full",
        className,
      )}
      href={href}
      onClick={onClick}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Link>
  );
}
