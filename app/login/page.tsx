import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { canAccessBackoffice } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/server";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user && canAccessBackoffice(user.role)) {
    redirect("/admin");
  }

  return (
    <main
      className="
min-h-screen
bg-slate-950
bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_35%)]
flex
items-center
justify-center
px-4
py-10
text-white
"
    >
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
