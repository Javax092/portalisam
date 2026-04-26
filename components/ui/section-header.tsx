import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        centered && "mx-auto max-w-3xl text-center sm:block",
        className,
      )}
    >
      <div className={cn("space-y-4", centered && "mx-auto")}>
        {eyebrow ? (
          <Badge className={cn("w-fit", centered && "mx-auto")} variant="muted">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="space-y-3">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className={cn("max-w-2xl text-base leading-7 text-slate-600", centered && "mx-auto")}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className={cn("shrink-0", centered && "mt-4")}>{action}</div> : null}
    </div>
  );
}
