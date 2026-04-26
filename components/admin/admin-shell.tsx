type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:p-6">
      {children}
    </div>
  );
}
