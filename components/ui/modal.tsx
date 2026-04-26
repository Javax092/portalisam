import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, title, description, onClose, children, footer }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-xl rounded-lg border border-white/70 bg-white p-6 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
            {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
          </div>
          <button
            aria-label="Fechar modal"
            className={cn(
              "premium-focus inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-slate-500 transition hover:bg-slate-50 hover:text-foreground",
            )}
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
