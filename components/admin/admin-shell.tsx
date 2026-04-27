type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return <div className="rounded-[2rem] border border-slate-200 bg-white text-slate-950 p-4 shadow-soft shadow-slate-200/70 sm:p-6">{children}</div>;
}
