import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "public" | "admin" | "immersive";
};

const variants = {
  public: "relative isolate w-full max-w-full overflow-hidden pb-24 pt-28 sm:pt-32",
  admin: "relative isolate w-full max-w-full overflow-hidden",
  immersive: "relative isolate min-h-screen w-full max-w-full overflow-hidden",
} as const;

export function PageContainer({
  children,
  className,
  variant = "public",
}: PageContainerProps) {
  return <main className={cn(variants[variant], className)}>{children}</main>;
}
