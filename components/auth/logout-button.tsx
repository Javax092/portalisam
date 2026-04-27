"use client";

import { useTransition } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";

type LogoutButtonProps = Pick<ButtonProps, "className" | "size" | "variant">;

export function LogoutButton({ className, size = "sm", variant = "secondary" }: LogoutButtonProps) {
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
    <Button className={className} onClick={handleLogout} size={size} variant={variant}>
      {isPending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Saindo...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Sair do painel
        </>
      )}
    </Button>
  );
}
