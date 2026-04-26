import { cn } from "@/lib/utils";

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "public" | "admin" | "wide";
};

export function SectionContainer({
  children,
  className,
  size = "public",
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        size === "wide" ? "max-w-[1536px]" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </section>
  );
}
