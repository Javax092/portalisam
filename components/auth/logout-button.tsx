"use client";

import { useTransition } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  };

  return (
    <Button onClick={handleLogout} size="sm" variant="secondary">
      {isPending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Saindo...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Sair
        </>
      )}
    </Button>
  );
}
